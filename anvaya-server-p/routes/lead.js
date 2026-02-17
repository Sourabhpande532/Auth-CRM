const express = require("express");
const app = express.Router();
const {
  obtainedLeads,
  CreateLead,
  getLeadDetailsById,
  updateLeadById,
} = require("../controllers/leadController");
const { varifyJWT } = require("../controllers/loginController");

app.get("/", varifyJWT, obtainedLeads);
app.post("/", varifyJWT, CreateLead);
app.put("/:leadId", varifyJWT, updateLeadById);
app.get("/:leadId", varifyJWT, getLeadDetailsById);

module.exports = app;
