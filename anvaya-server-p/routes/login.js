const express = require("express");
const app = express.Router();
const loginCtrl = require("../controllers/loginController");

app.post("/", loginCtrl.LoginAdmin);
app.get("/main", loginCtrl.varifyJWT, loginCtrl.ProtectedAdmin);

module.exports = app;
