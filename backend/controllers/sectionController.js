const User = require("../models/userModel");
const Section = require("../models/sectionModel");
const Page = require("../models/pageModel");
const Canvas = require("../models/canvasModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const createSection = async (req, res) => {
  try {
    const userId = req.user.id; // authenticated user
    const { title, sectionId } = req.body;

    if (!title && title.trim() === "") {
      return res.status(400).json({ message: "Title, sectionId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log(user);
    const section = await Section.create({
      _id: sectionId || uuid(),
      title: title || "New Section",
      user: userId,
    });
    //console.log("sec", section);

    user.sections.push(section._id);
    await user.save(); // save updated user

    res.status(201).json({ section, message: "Section created", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSections = async (req, res) => {
  try {
    const userId = req.user.id; // authenticated user

    const user = await User.findById(userId).populate({
      path: "sections",
      populate: [
        { path: "pages", select: "-content" },
        { path: "canvases", select: "-content" },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //console.log(user);
    res.status(201).json({ section: user.sections, message: "", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sectionId } = req.params;
    const userId = req.user.id;

    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required" });
    }

    // 1️⃣ Check if section exists
    const section = await Section.findById(sectionId).session(session);
    if (!section) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Section not found" });
    }

    // 2️⃣ Verify ownership
    if (section.user.toString() !== userId) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this section" });
    }

    // 3️⃣ Remove section reference from User
    await User.findByIdAndUpdate(
      userId,
      { $pull: { sections: sectionId } },
      { session }
    );

    // 4️⃣ Delete related pages
    await Page.deleteMany({ section: sectionId, user: userId }).session(
      session
    );

    // 4️⃣ Delete related canvases
    await Canvas.deleteMany({ section: sectionId, user: userId }).session(
      session
    );

    // 5️⃣ Delete the section itself
    await Section.findByIdAndDelete(sectionId).session(session);

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Section and related pages deleted successfully",
      sectionId,
    });
  } catch (error) {
    console.error("❌ Transaction Error:", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error while deleting section" });
  }
};

const renameSection = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { sectionId } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    // Find section and verify ownership
    const section = await Section.findOne({ _id: sectionId, user: userId });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    section.title = title;
    await section.save();

    res.status(200).json({
      section,
      message: "Section renamed successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error renaming section:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSection, getSections, renameSection, deleteSection };
