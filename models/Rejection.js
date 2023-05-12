const mongoose = require("mongoose")

const RejectionSchema = new mongoose.Schema(
  {
    application_id: {type: String, required: true},
    reason: {type: String, required: true}
  },
  { timestamps: true }
)

module.exports = mongoose.model("Rejection", RejectionSchema)