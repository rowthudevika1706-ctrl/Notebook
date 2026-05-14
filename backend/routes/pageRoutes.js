const express = require("express");
const router = express.Router();
const {
  createPage,
  getPage,
  updatePage,
  deletePage,
  updatePageTitle,
  updatePageContent,
  movePage,
} = require("../controllers/pageController");

router.post("/create", createPage);

router.get("/:pageId", getPage);

router.put("/:pageId", updatePage);

router.patch("/title/:pageId", updatePageTitle);

router.patch("/content/:pageId", updatePageContent);

router.delete("/:sectionId/:pageId", deletePage);

module.exports = router;
