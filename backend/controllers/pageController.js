const mongoose = require("mongoose");
const User = require("../models/userModel");
const Section = require("../models/sectionModel");
const Page = require("../models/pageModel");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const createPage = async (req, res) => {
  try {
    const userId = req.user.id; // authenticated user
    const { sectionId, pageId } = req.body;

    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required" });
    }
    const section = await Section.findById(sectionId);

    // Find section and add page
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    // console.log("section", section);

    // Create new page
    const page = await Page.create({
      title: `New Note ${section.pages.length + 1}`,
      user: userId,
      section: sectionId,
      _id: pageId || uuid(),
    });

    // console.log("page", page);

    section.pages.push(page._id);
    await section.save();

    res.status(201).json({
      page,
      message: "Page created successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const userId = req.user.id;

    const page = await Page.findById(pageId);

    if (!page || page.user != userId) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json({ page, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sectionId, pageId } = req.params;
    const userId = req.user.id; // from auth middleware

    // 1️⃣ Verify section exists and belongs to the user
    const section = await Section.findById(sectionId).session(session);
    if (!section) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Section not found" });
    }

    if (section.user.toString() !== userId) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this page" });
    }

    // 2️⃣ Remove page reference from the section
    await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { pages: pageId } },
      { session }
    );

    // 3️⃣ Delete the page document
    await Page.findByIdAndDelete(pageId).session(session);

    // ✅ Commit if all succeeded
    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("❌ Transaction Error:", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error while deleting page" });
  }
};

const updatePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { title, content } = req.body;

    if (!pageId) {
      return res.status(400).json({ message: "Page ID is required" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (title && title.trim() !== "") page.title = title;
    if (content && content.trim() !== "") page.content = content;

    await page.save();

    res
      .status(200)
      .json({ page, message: "Page updated successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePageTitle = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { title } = req.body;
    // console.log("title", title);

    if (!pageId) {
      return res.status(400).json({ message: "Page ID is required" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (title && title.trim() !== "") page.title = title;

    // console.log(page)
    await page.save();

    res
      .status(200)
      .json({ page, message: "Page title updated successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePageContent = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { content } = req.body;
    if (!pageId) {
      return res.status(400).json({ message: "Page ID is required" });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (content && content.trim() !== "") page.content = content;

    //  console.log(page)
    await page.save();

    res.status(200).json({
      page,
      message: "Page content updated successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createPage,
  getPage,
  updatePage,
  deletePage,
  updatePageTitle,
  updatePageContent,
};
