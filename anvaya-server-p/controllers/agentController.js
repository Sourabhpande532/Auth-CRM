const Agents = require("../models/Agents");

exports.obtainedAgents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const agents = await Agents.find();
    if (agents.length != 0) {
      res.status(200).json({
        userId,
        success: true,
        data: { agents },
        message: "Fetch all sales agents.",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found." });
    }
  } catch (error) {
    console.error(error.message, "occured by get agents.");
    return res.status(500).json({
      success: false,
      error: "Internal server error agents",
    });
  }
};

exports.createAgents = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        error: "Invalid input: 'email' must be a valid email address. ",
      });
    }
    const exists = await Agents.findOne({ email });
    if (exists) {
      return res.status(409).json({
        error: `Sales agent with email ${exists.email} already exists.`,
      });
    }
    const agent = new Agents(req.body);
    const agents = await agent.save();
    res.status(201).json({ success: true, data: { agents } });
  } catch (error) {
    console.error(error.message, "Creating agent error");
    res.status(500).json({
      success: false,
      message: "Internal server error agent.",
      error: error.message,
    });
  }
};

exports.editAgents = async (req, res) => {
  try {
    const agents = await Agents.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Agent update successfully",
      data: { agents },
    });
  } catch (error) {
    console.error(error.message, "edit agents");
    return res.status(500).json({
      success: false,
      message: "Internal server error edit agent.",
      error: error.message,
    });
  }
};
