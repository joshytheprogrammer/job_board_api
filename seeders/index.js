const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
mongoose.connect(process.env.DEV_MONGO_URL);

require("./user");
require("./job");

return;

// const Job = require('../models/Job'); // Import your model

// async function deleteAllExceptOne() {
//   try {
//     const filter = { _id: { $ne: '64357044eaeb192334df425d' } }; // Replace 'id_of_item_to_keep' with the ID of the item you want to keep
//     const result = await Job.deleteMany(filter);

//     console.log(`${result.deletedCount} items deleted.`);
//   } catch (err) {
//     console.error(err);
//   }
// }

// deleteAllExceptOne();
