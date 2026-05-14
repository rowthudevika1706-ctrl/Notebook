const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const pageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    section: {
      type: String,
      ref: "Section",
    },
  },
  { timestamps: true }
);

pageSchema.index({ user: 1 });
pageSchema.index({ section: 1 });

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;
