const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_key";

exports.LoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== "admin@gmail.com" || password !== "1234") {
      return res.status(401).json({ message: "Invalid Credential" });
    }
    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error occuring login credentials:", error.message);
  }
};

exports.varifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("error occuring varifyjwt:", error.message);
  }
};

exports.ProtectedAdmin = async (req, res) => {
  try {
    res.json({
      message: "Protected Data",
      user: req.user,
    });
  } catch (error) {
    console.error("Error occuring giving access:", error.message);
    res
      .json(500)
      .json({ success: false, message: "Internal server error admin token" });
  }
};
