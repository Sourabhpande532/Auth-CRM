const express = require("express");
const router = express.Router();
const SalesLead = require("../models/Lead");

/*
-------------------------------------------------
REPORT 1
GET /report/last-week
Leads closed in the last 7 days
-------------------------------------------------
*/
router.get("/last-weeks", async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const leads = await SalesLead.find()
      .populate("salesAgent", "name")
      .select("name status closedAt salesAgent");

    const closedLastWeek = leads
      .filter(
        (lead) =>
          lead.status === "Closed" &&
          lead.closedAt &&
          new Date(lead.closedAt) >= weekAgo,
      )
      .map((lead) => ({
        id: lead._id,
        name: lead.name,
        salesAgent: lead.salesAgent?.name || null,
        closedAt: lead.closedAt,
      }));

    res.json(closedLastWeek);
  } catch (error) {
    console.error("Error in /report/last-week:", error);
    res.status(500).json({ message: "Server error fetching last week report" });
  }
});

module.exports = router;
