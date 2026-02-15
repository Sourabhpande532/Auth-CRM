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
    if (status) {
      const validStatus = [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Closed",
      ];
      if (!validStatus.includes(status)) {
        return next(
          createErrors({
            status: 400,
            message:
              "Invalid input: 'Status' must be one of ['New','Contacted', 'Qualified', 'Proposal Sent', 'Closed']",
          }),
        );
      }
      filter.status = status;
    }
    if (source) {
      const validSource = [
        "Website",
        "Referral",
        "Cold Call",
        "Advertisement",
        "Email",
        "Other",
      ];
      if (!validSource.includes(source)) {
        return next(
          createErrors({
            status: 400,
            message:
              "Invalid Input: 'source' must be one of ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email','Other'] ",
          }),
        );
      }
      filter.source = source;
    }
    /* ----- Tags Filter ----- */
    if (tags) {
      filter.tags = { $all: Array.isArray(tags) ? tags : tags.split(",") };
    }

    let query = Lead.find(filter).populate({
      path: "salesAgent",
      select: "name email",
    });

    /* ---- sorting ---- */
    if (sortBy) {
      const allowedSortFields = [
        "createdAt",
        "updatedAt",
        "priority",
        "status",
      ];
      if (!allowedSortFields.includes(sortBy)) {
        return next(
          createErrors({
            status: 400,
            message: `Invalid input: 'sortBy' must be one of ${allowedSortFields.join(", ")} `,
          }),
        );
      }
      query = query.sort({
        [sortBy]: sortDir === "desc" ? -1 : 1,
      });
    }
    const leads = await query.exec();
    res
      .status(200)
      .json({ success: true, count: leads.length, data: { leads } });
  } catch (error) {
    console.error(error.message);
    return next(error);
  }
};

exports.CreateLead = async (req, res, next) => {
  try {
    const payload = req.body;
    const { name, source, salesAgent, status, timeToClose, priority } = payload;
    if (!name || typeof name !== "string") {
      return next(
        createErrors({
          message: "Invalid input: 'name' is required and must be a string.",
          status: 400,
        }),
      );
    }
    /* --- source validation --- */
    const validSource = [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ];
    if (!source || !validSource.includes(source)) {
      return next(
        createErrors({
          status: 400,
          message:
            "Invalid input: 'source' must be one of Website, Referral, Cold Call, Advertisement, Email, Other.",
        }),
      );
    }

    // Validation ObjectId
    if (salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
        return next(
          createErrors({
            status: 400,
            message: `Invalid salesAgent ID formate`,
          }),
        );
      }
    }

    // Check if sales agent exists
    const agentExists = await SalesAgents.findById(salesAgent);
    if (!agentExists) {
      return next(
        createErrors({
          status: 404,
          message: `Sales agent with ID '${salesAgent}' not found `,
        }),
      );
    }

    // Status validation
    if (status) {
      const validStatus = [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Closed",
      ];
      if (!status || !validStatus.includes(status)) {
        return next(
          createErrors({
            status: 400,
            message:
              "Invalid input: 'status' must be one of New, Contacted, Qualified, Proposal Sent, Closed.",
          }),
        );
      }
    }

    // timeToClose validation
    if (timeToClose !== undefined) {
      if (!Number.isInteger(timeToClose) || timeToClose <= 0) {
        return next(
          createErrors({
            status: 400,
            message: "Invalid input: 'timeToClose' must be a positive integer.",
          }),
        );
      }
    }

    // priority validation
    if (priority) {
      const validPriority = ["High", "Medium", "Low"];
      if (!validPriority.includes(priority)) {
        return next(
          createErrors({
            status: 400,
            message:
              "Invalid input: 'priority' must be one of High, Medium, Low.",
          }),
        );
      }
    }
    const newLead = await new Lead(payload).save();
    await newLead.populate({ path: "salesAgent", select: "name email" });
    return res.status(201).json({ success: true, data: { lead: newLead } });
  } catch (error) {
    return next(error);
  }
};

exports.getLeadDetailsById = async (req, res, next) => {
  const { leadId } = req.params;
  if (leadId) {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return next(
        createErrors({
          status: 404,
          message: `Lead with ID '${leadId}' not found. `,
        }),
      );
    }
  }
  try {
    const leads = await Lead.findById(leadId).populate(
      "salesAgent",
      "name email",
    );
    res.status(200).json({ success: true, data: { leads } });
  } catch (error) {
    console.error(error.message);
    return next(error);
  }
};

/* ?tags=Follow-up return array && 1st conditio true o.w ?tags=Follow-up,High value 2nd condtion true. 
$all checks that a field contains all the specified values in an order. inside an array. */
