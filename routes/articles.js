const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentOnArticle,
  patchArticleVote
} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVote);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentOnArticle);

module.exports = articlesRouter;
