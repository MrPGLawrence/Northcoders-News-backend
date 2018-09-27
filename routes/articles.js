const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticlesById,
  getCommentsByArticleId
} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);

articlesRouter.route("/:article_id").get(getArticlesById);

articlesRouter.route("/:article_id/comments").get(getCommentsByArticleId);

module.exports = articlesRouter;
