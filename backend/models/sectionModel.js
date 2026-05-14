const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const sectionSchema = new mongoose.Schema(
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
    pages: [
      {
        type: String,
        ref: "Page",
      },
    ],
    canvases: [
      {
        type: String,
        ref: "Canvas",
      },
    ],
  },
  { timestamps: true }
);

sectionSchema.index({ user: 1 });
sectionSchema.index({ pages: 1 });

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
