const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  engName: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  episode: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  currentTime: {
    type: String,
    reuired: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", historySchema);
