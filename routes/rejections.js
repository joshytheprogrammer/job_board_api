const router = require('express').Router();
const Rejection = require("../models/Rejection");

// GET /api/rejections/:application_id
router.get("/:application_id", async (req, res) => {
  const appID = req.params.application_id;

  // Validate the application_id parameter
  if (!appID) {
    return res.status(400).json({ message: "Missing application_id parameter" });
  }

  // Find the rejection by application_id
  try {
    const rejection = await Rejection.findOne({ application_id: appID });

    // If rejection is not found, return an error
    if (!rejection) {
      return res.status(404).json({ message: "Rejection not found" });
    }

    // Return the reason for rejection
    res.status(200).json({ reason: rejection.reason });
  } catch (error) {
    // Handle any other errors that occur
    console.log("Error retrieving rejection:", error);
    res.status(401).json({ message: "Internal server error" });
  }
});

module.exports = router;