const mongoose = require("mongoose");

require("dotenv").config();

const MONGOURI = process.env.MONGODB;

async function connectToDB() {
  await mongoose
    .connect(MONGOURI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((e) => {
      console.log("DB Connection error");
      throw e;
    });
}

module.exports = { connectToDB };
