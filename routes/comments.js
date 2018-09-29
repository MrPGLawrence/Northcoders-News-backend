const commentsRouter = require("express").Router();
const {
  getAllComments,
  getCommentById,
  patchCommentVote,
  deleteComment
} = require("../controllers/comments");

commentsRouter.route("/").get(getAllComments);

commentsRouter
  .route("/:comment_id")
  .get(getCommentById)
  .patch(patchCommentVote)
  .delete(deleteComment);

module.exports = commentsRouter;
