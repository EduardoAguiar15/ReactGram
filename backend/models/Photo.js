const mongoose = require("mongoose");
const { Schema } = mongoose;

const photoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    likes: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }],
      default: [],
    },
    comments: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      }],
      default: [],
    },
  },
  { timestamps: true });

const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;