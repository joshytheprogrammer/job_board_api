const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

const auth = require("./routes/auth");
const job = require("./routes/job")

const validateToken = require('./middleware/validateToken');

dotenv.config();
const app = express();

app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: ['*', 'http://localhost:3000']
}));

app.use(bodyParser.json());

if(process.env.NODE_ENV == 'development') {
  mongoose.connect(process.env.DEV_MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err)
  });

}

if(process.env.NODE_ENV == 'production') {

  mongoose.connect(process.env.PROD_MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err)
  });

}

// Define routes
app.use("/api/auth", auth);
app.use("/api/job", job);

app.get('/api/protected', validateToken, (req, res) => {
  // Access user information from req.user object
  const user = req.user;

  // Handle request logic...
  if(user) {
    res.status(200).json({"data": user})
  }else {
    res.status(401).json({"error": "User not found"})
  }
});