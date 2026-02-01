const Lead = require("../models/Lead");
const SalesAgents = require("../models/Agents");
const mongoose = require("mongoose");
const createErrors = require("../utils/createError");

exports.obtainedLeads = async (req, res, next) => {
  try {
    const { salesAgent, status, tags, source, sortBy, sortDir } = req.query;
    const filter = {};
    /* --- salesAgent validation --- */
    if (salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
        return next(
          createErrors({
            status: 400,
            message: "Invalid input: 'salesAgent' must be a valid ObjectId",
          }),
        );
      }
      filter.salesAgent = salesAgent;
    }
    /* --- status validation --- */
    if(status){
        
    }
    const lead = await Lead.find(filter).populate("salesAgent");
    res.status(200).json({ success: true, data: { lead } });
  } catch (error) {
    return next(error);
  }
};

exports.CreateLead = async (req, res, next) => {
  try {
    const payload = req.body;
    const { name, salesAgent } = payload;
    if (!name || !salesAgent) {
      return next(
        createErrors({
          message: "Invalid input: name or salesAgent is required.",
          status: 400,
        }),
      );
    }
    // Validation ObjectId
    if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
      return next(
        createErrors({
          status: 400,
          message: `Invalid salesAgent ID formate`,
        }),
      );
    }

    // Check if sales agent exists
    const agentExists = await SalesAgents.findById(salesAgent);

    if (!agentExists.salesAgent) {
      return next(
        createErrors({
          status: 404,
          message: `Sales agent with ID '${salesAgent}' not found `,
        }),
      );
    }
    const newLead = await new Lead(payload).save();
    await newLead.populate({ path: "salesAgent", select: "name email" });
    return res.status(201).json({ success: true, data: { lead: newLead } });
  } catch (error) {
    return next(error);
  }
};
