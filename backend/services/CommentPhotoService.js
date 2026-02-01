const Comment = require("../models/Comment");
const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const { InvalidIdError, PhotoNotFoundError, CommentNotFoundError } = require("../errors/typeError");

async function postCommentOrReply(photoId, { comment, replyTo, user }) {
  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    throw new InvalidIdError();
  }

  if (!comment || comment.trim() === "") {
    throw new Error("O comentário não pode estar vazio.");
  }

  const photo = await Photo.findById(photoId);
  if (!photo) {
    throw new PhotoNotFoundError();
  }

  if (replyTo) {
    if (!mongoose.Types.ObjectId.isValid(replyTo)) {
      throw new InvalidIdError();
    }

    const parentComment = await Comment.findById(replyTo);
    if (!parentComment) {
      throw new CommentNotFoundError();
    }

    parentComment.replies.push({
      userId: user._id,
      comment,
    });

    await parentComment.save();

    return {
      type: "reply",
      comment
    };
  }

  const newComment = await Comment.create({
    photoId: photo._id,
    userId: user._id,
    comment,
  });

  photo.comments.push(newComment._id);
  await photo.save();

  return {
    type: "comment",
    comment
  };
}

async function likeComment(commentId, userId) {

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new InvalidIdError();
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new CommentNotFoundError();
  }

  const alreadyLiked = comment.like.includes(userId);

  if (alreadyLiked) {
    comment.like.pull(userId);
  } else {
    comment.like.push(userId);
  }

  await comment.save();

  return {
    liked: !alreadyLiked,
    commentId,
    userId
  };
}

async function getCommentsByPhotoId(photoId) {

  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    throw new InvalidIdError();
  }

  const comments = await Comment.find({ photoId })
    .populate("photoId", "title image")
    .populate("userId", "name profileImage")
    .populate("replies.userId", "name profileImage")
    .sort({ createdAt: -1 })
    .lean();

  return comments;
}

async function getAllComments() {
  const comments = await Comment.find()
    .populate("photoId", "title")
    .populate("userId", "userName")
    .populate("replies.userId", "name profileImage")
    .lean();

  return comments;
}

module.exports = {
  postCommentOrReply,
  likeComment,
  getCommentsByPhotoId,
  getAllComments
};