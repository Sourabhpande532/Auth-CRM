const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const SalesLead = require("../models/Lead");
const createErrors = require("../utils/createError");

exports.getComments = async (req, res, next) => {
  const leadId = req.params.id;
  if (leadId) {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return next(
        createErrors({
          status: 404,
          message: `Lead With ID '${leadId}' not found. `,
        }),
      );
    }
  }
  try {
    const comments = await Comment.find({ lead: leadId })
      .populate("author", "name email")
      .populate("lead", "name status")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { comments } });
  } catch (error) {
    return next(error);
  }
};

exports.addCommentToLead = async (req, res, next) => {
  const { author, commentText } = req.body;
  const leadId = req.params.id;
  const userId = req.user.id;
  if (!commentText || typeof commentText !== "string") {
    return next(
      createErrors({
        status: 400,
        message:
          "Invalid input: 'commentText' is required and must be a string.",
      }),
    );
  }
  if (author) {
    if (!mongoose.Types.ObjectId.isValid(author)) {
      return next(
        createErrors({
          status: 400,
          message: "Invalid author it must be a valid objectId",
        }),
      );
    }
  }
  if (leadId) {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return next(
        createErrors({
          status: 404,
          message: `Lead with Id '${leadId}' not found. `,
        }),
      );
    }
  }
  const existingLeadIfPair = await SalesLead.findById(leadId);
  if (!existingLeadIfPair) {
    return next(
      createErrors({
        status: 400,
        message: `Lead with Id '${leadId}' not found. `,
      }),
    );
  }
  try {
    const comments = await new Comment({
      lead: leadId,
      author,
      commentText,
    }).save();
    await comments.populate("author", "name email");
    res.status(201).json({ success: true, data: { comments } });
  } catch (error) {
    console.error(error.message);
    return next(error);
  }
};

exports.updateLeadComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { commentText } = req.body;
  if (commentId) {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(
        createErrors({
          status: 404,
          message: `Lead with ID '${commentId}' not found. `,
        }),
      );
    }
  }
  if (!commentText || typeof commentText !== "string") {
    return next(
      createErrors({
        status: 404,
        message: "Comment text is required",
      }),
    );
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment)
      return next(createErrors({ status: 404, message: "Comment not found." }));
    comment.commentText = commentText;
    await comment.save();
    await comment.populate("author", "name email");
    res.status(200).json({
      success: true,
      data: { comment },
    });
  } catch (error) {
    console.error(error.message);
    return next(error);
  }
};
