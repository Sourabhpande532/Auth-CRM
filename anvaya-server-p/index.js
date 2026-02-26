const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const { databaseInitialization } = require("./db/db.connect");
const cookieParser = require("cookie-parser");
databaseInitialization();
const corsOption = {
  origin: "*",
  credential: true,
};
app.use(express.json());
app.use(cors(corsOption));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use((err, _req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({
    success: false,
    message,
    stack: err.stack,
  });
});

app.use("/api/admin", require("./routes/login"));
app.use("/api/admin", require("./routes/login"));
app.use("/api/agents", require("./routes/agents"));
app.use("/api/leads", require("./routes/lead"));
app.use("/api/leads", require("./routes/comment"));
app.use("/api/tags", require("./routes/tagRoutes"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Running at: http://localhost:${PORT}`);
});
