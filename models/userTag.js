const mongoose = require("mongoose")

const userTagSchema = new mongoose.Schema(
  {
    user_id: {type: String, required: true, unique: true},
    tags: {type: Array, required: true}
  },
  { timestamps: true }
)

module.exports = mongoose.model("userTag", userTagSchema)