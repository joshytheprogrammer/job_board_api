const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema(
  {
    creator_id: {type: String, required: true},
    title: {type: String, required: true},
    desc: {type: String, required: true},
    offer: {type: Object, required: true},
    keywords: {type: Array, required: true},
    status: {type: String, required: true}
  },
  { timestamps: true }
)

module.exports = mongoose.model("Job", JobSchema)