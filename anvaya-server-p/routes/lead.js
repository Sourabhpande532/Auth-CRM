const express = require("express");
const app = express.Router();
const { obtainedLeads, CreateLead } = require("../controllers/leadController");
const { varifyJWT } = require("../controllers/loginController");

app.get("/", varifyJWT, obtainedLeads);
app.post("/", varifyJWT, CreateLead);

module.exports = app;
