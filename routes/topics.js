const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getArticlesOnTopic,
  postArticleOnTopic
} = require("../controllers/topics");

topicsRouter.route("/").get(getAllTopics);

topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesOnTopic)
  .post(postArticleOnTopic);

module.exports = topicsRouter;
