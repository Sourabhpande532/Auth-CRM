const express = require("express");
const app = express.Router();
const leadCtrl = require("../controllers/leadController");

app.get("/", leadCtrl.obtainedLeads);
app.post("/", leadCtrl.CreateLead);

module.exports = app;
