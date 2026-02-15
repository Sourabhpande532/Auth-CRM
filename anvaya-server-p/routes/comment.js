const express = require("express");
const app = express.Router();
const {
  addCommentToLead,
  getComments,
  updateLeadComment,
} = require("../controllers/commentController");
const { varifyJWT } = require("../controllers/loginController");
app.get("/:id/comments", varifyJWT, getComments);
app.post("/:id/comments", varifyJWT, addCommentToLead);
app.put("/comments/:commentId", varifyJWT, updateLeadComment);
module.exports = app;
