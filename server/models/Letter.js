const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const LetterSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
  },
  {
    toJSON: { getters: true },
  }
);

const Letter = model("Letter", LetterSchema);

module.exports = Letter;
