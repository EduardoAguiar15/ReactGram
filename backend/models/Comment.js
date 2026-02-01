const mongoose = require("mongoose");
const { Schema } = mongoose;

// SUBDOCUMENT
const replySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// DOCUMENT
const commentSchema = new Schema({
  photoId: {
    type: Schema.Types.ObjectId,
    ref: "Photo",
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  replies: {
    type: [replySchema],
    default: [],
  },
  like: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    default: [],
  },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;