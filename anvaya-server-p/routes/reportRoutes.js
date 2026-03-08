const express = require("express");
const app = express.Router();
const salesLead = require("../models/Lead");

app.get("/all-leads", async (req, res) => {
  try {
    const leads = await salesLead
      .find()
      .populate("salesAgent", "name")
      .select("name status salesAgent closedAt createdAt");

    const formatted = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      status: lead.status,
      salesAgent: lead.salesAgent?.name || "Unassigned",
      closedAt: lead.closedAt,
      createdAt: lead.createdAt,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching leads for reports",
    });
  }
});

module.exports = app;