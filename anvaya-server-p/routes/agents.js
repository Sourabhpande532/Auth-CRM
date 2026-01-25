const express = require("express");
const app = express.Router();
const agentCtrl = require("../controllers/agentController");
const auth = require("../controllers/loginController");
app.post("/", auth.varifyJWT, agentCtrl.createAgents);
app.get("/", auth.varifyJWT, agentCtrl.obtainedAgents);
app.put("/:id", auth.varifyJWT, agentCtrl.editAgents);

module.exports = app;
