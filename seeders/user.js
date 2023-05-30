const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require('../models/User'); 

dotenv.config();
mongoose.connect(process.env.DEV_MONGO_URL);

function generateFakeUser() {
  const username = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const hashedPassword = bcrypt.hashSync(password, 10);

  return {
    username: username,
    email: email,
    password: hashedPassword,
    isAdmin: false,
  };
}

async function seedUsers() {
  const userCount = 10; // Number of users to generate

  for (let i = 0; i < userCount; i++) {
    const userData = generateFakeUser();
    const newUser = new User(userData);

    try {
      await newUser.save();
    } catch (err) {
      console.error(err);
    }
  }

  console.log("Seeded 10 users successfully")

  return
}

seedUsers();
