const Canvas = require("../models/canvasModel");
const User = require("../models/userModel");
const Section = require("../models/sectionModel");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const createCanvas = async (req, res) => {
  try {
    const UserId = req.user.id;
    const { title, canvasId, sectionId } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const user = await User.findById(UserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const canvas = await Canvas.create({
      _id: canvasId || uuid(),
      title: `New Drawing ${section.canvases.length + 1}`,
      user: UserId,
      section: sectionId,
    });

    console.log(canvas);

    section.canvases.push(canvas._id);
    await section.save();
    await canvas.save();
    res.status(201).json({
      canvas,
      message: "Canvas created successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCanvas = async (req, res) => {
  try {
    const { canvasId } = req.params;
    const canvas = await Canvas.findById(canvasId);
    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }
    // console.log(canvas);
    res.status(200).json({ canvas, message: "Canvas found", status: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCanvasTitle = async (req, res) => {
  try {
    const { canvasId } = req.params;
    const { title } = req.body;
    const canvas = await Canvas.findById(canvasId);
    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }
    if (title && title.trim() !== "") {
      canvas.title = title;
    }
    await canvas.save();
    res.status(200).json({ canvas, message: "Canvas updated", status: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCanvasContent = async (req, res) => {
  try {
    // console.log("canvas content")
    const { canvasId } = req.params;
    const { content } = req.body;
    // console.log(canvasId, content);
    const canvas = await Canvas.findById(canvasId);
    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }
    canvas.content = content;
    await canvas.save();
    res.status(200).json({ canvas, message: "Canvas updated", status: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCanvas = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sectionId, canvasId } = req.params;
    const userId = req.user.id;

    // 1️⃣ Verify user
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Verify section
    const section = await Section.findById(sectionId).session(session);
    if (!section) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Section not found" });
    }

    // 3️⃣ Verify canvas
    const canvas = await Canvas.findById(canvasId).session(session);
    if (!canvas) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Canvas not found" });
    }

    // 4️⃣ Remove canvas from section
    section.canvases.pull(canvasId);
    await section.save({ session });

    // 5️⃣ Delete canvas document
    await canvas.deleteOne({ session });

    // 6️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Canvas deleted successfully", status: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error deleting canvas:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCanvas,
  getCanvas,
  updateCanvasTitle,
  updateCanvasContent,
  deleteCanvas,
};
