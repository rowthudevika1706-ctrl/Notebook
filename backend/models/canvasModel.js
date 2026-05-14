const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const canvasSchema = new mongoose.Schema(
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

canvasSchema.index({ user: 1 });
canvasSchema.index({ section: 1 });

const Canvas = mongoose.model("Canvas", canvasSchema);
module.exports = Canvas;
