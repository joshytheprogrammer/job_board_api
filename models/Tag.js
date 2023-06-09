const mongoose = require("mongoose")

const TagSchema = new mongoose.Schema(
  {
    tag_name: {type: String, required: true, unique: true},
    tag_state: {type: String, required: false}
  },
  { timestamps: true }
)

module.exports = mongoose.model("Tag", TagSchema)