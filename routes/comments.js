const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/comments");

commentsRouter.route("/comments/:comment_id").delete(deleteComment);

module.exports = commentsRouter;
