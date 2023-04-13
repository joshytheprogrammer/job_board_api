const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

const auth = require("./routes/auth");
const validateToken = require('./middleware/validateToken');

dotenv.config();
const app = express();

if(process.env.NODE_ENV == 'development') {
  mongoose.connect(process.env.DEV_MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.log(err)
  });

}else if(process.env.NODE_ENV == 'production') {
  mongoose.connect(process.env.PROD_MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.log(err)
  });

}


console.log(process.env.NODE_ENV)

app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

app.use(bodyParser.json());

app.listen(process.env.PORT || 3000);

// Define routes
app.use("/api/auth", auth);

app.get('/api/protected', validateToken, (req, res) => {
  // Access user information from req.user object
  const user = req.user;

  // Handle request logic...
  res.status(200).json({"message": `Operation Successful for user - ${user.name}`})
});