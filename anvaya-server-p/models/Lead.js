const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lead name is required"],
  },
  source: {
    type: String,
    required: [true, "Lead source is required"],
    enum: [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ],
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AnvayaSalesAgent",
    required: [true, "Sales Agent is required"],
  },
  status: {
    type: String,
    required: true,
    enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
    default: "New",
  },
  tags: {
    type: [String],
  },
  timeToClose: {
    type: Number,
    required: [true, "Time to Close is required"],
    min: [1, "Time to Close must be a positive number"],
  },
  priority: {
    type: String,
    required: true,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date, // closed date of lead closed(used when status is closed)
  },
});

leadSchema.pre("save", function () {
  this.updatedAt = Date.now();
  if (this.name) {
    this.name = this.name.toUpperCase();
  }

  if (this.isModified("status") && this.status === "Closed" && !this.closedAt) {
    this.closedAt = Date.now();
  }
});

module.exports = mongoose.model("AnvayaLead", leadSchema);

/* NOTES:STUDY
 Middleware to update the `updatedAt` field on each save Or in other word Before a document is saved in MongoDB, this function will run automatically and update the field:So, every time you save a lead, its updatedAt field becomes the latest current date/time.
 e.g frontend type name(input f) -> between(below function run) ->Submit then stored
 E>G
leadSchema.pre('save', function() {
   this.name = this.name.toLowerCase();
 });

Using: WHEN UPDATE STATUS 
What is this.isModified('status') ?
This function checks:true[was changed],false[stay same]
Did the user change the "status" field Before saving?

why ?
'!this.closedAt' = “closedAt is empty, so we can now set it.”
“closedAt is NOT set yet.”
This is just a check to see if the field is empty.
These are called falsy values → when you put !value, it becomes true.
let a; undefined now console.log(!a); true 
let b=null; null now console.log(!a); true
let c="" empty string console.log(!c); true
 
let a="hellow" console.log(!a); false
let b=23; console.log(!b); false 
closedAt: {
    type: Date, // The date when the lead was closed (optional, used when status is "Closed")
  },

*/
