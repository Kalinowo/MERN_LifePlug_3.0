const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
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
    type: [String],
    default: [],
  },
  year: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  agent: {
    type: String,
    required: true,
  },
  producer: {
    type: String,
    required: true,
  },
  blurHash: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
  },
  view: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Anime", animeSchema);
