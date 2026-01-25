const express = require("express");
const app = express();
const cors = require("cors");
const { databaseInitialization } = require( "./db/db.connect" );
databaseInitialization()
const corsOption = {
  origin: "*",
  credential: true,
};
app.use(express.json());
app.use(cors(corsOption));

app.use("/api/admin", require("./routes/login"));
app.use("/api/admin", require("./routes/login"));
app.use("/api/agents", require("./routes/agents"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Running at: http://localhost:${PORT}`);
});
