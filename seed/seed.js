const mongoose = require("mongoose");
const { User, Topic, Article, Comment } = require("../models");
const {
  formatUserData,
  formatTopicData,
  formatArticleData,
  formatCommentData
} = require("../utils");

const seedDB = (userData, topicData, articleData, commentData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        User.insertMany(formatUserData(userData)),
        Topic.insertMany(formatTopicData(topicData))
      ]);
    })
    .then(([userDocs, topicDocs]) => {
      return Promise.all([
        userDocs,
        topicDocs,
        Article.insertMany(formatArticleData(userDocs, topicDocs, articleData))
      ]);
    })
    .then(([userDocs, topicDocs, articleDocs]) => {
      return Promise.all([
        userDocs,
        topicDocs,
        articleDocs,
        Comment.insertMany(formatCommentData(userDocs, articleDocs))
      ]);
    })
    .catch(err => {
      console.log("seeding error", err);
    });
};

module.exports = seedDB;
