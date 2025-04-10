const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgURL: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    OP: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pg40User",
    },
    comments: [
      {
        text: {
          type: String,
        },
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pg40User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pg40Post", postSchema);
