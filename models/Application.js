const mongoose = require("mongoose")

const ApplicationSchema = new mongoose.Schema(
  {
    user_id: {type: String, required: true}, // ID of the user that applied
    job_id: {type: String, required: true}, // ID of the job the user applied to
    data: {type: Object, required: true}, // [{headline, details}]
    bid: {type: Number, required: true},
    files: {type: Array, required: false},
    status: {type: String, required: true}
  },
  { timestamps: true }
)

module.exports = mongoose.model("Application", ApplicationSchema)