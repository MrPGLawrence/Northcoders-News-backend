const seedDB = require("./seed");
const mongoose = require("mongoose");
const { DB_URL } = require("../config");
const NODE_ENV = process.env.NODE_ENV || "development";
const {
  userData,
  topicData,
  articleData,
  commentData
} = require(`./${NODE_ENV}Data/`);

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => seedDB(userData, topicData, articleData, commentData))
  .then(() => {
    console.log("Database seeded");
    mongoose.disconnect();
  });
