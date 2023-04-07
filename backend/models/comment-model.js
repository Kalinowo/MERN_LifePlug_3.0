const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    episode: {
      type: String,
    },
    responseTo: {
      type: String,
    },
    host: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
