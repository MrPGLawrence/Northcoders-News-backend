const { Comment } = require("../models");

exports.getAllComments = (req, res, next) => {
  Comment.find(null, "-__v")
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getCommentById = (req, res, next) => {
  Comment.findById(req.params.comment_id, "-__v")
    .populate("created_by")
    .then(comment => {
      if (!comment) {
        throw { msg: "Comment Not Found", status: 404 };
      } else res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  Comment.findOneAndDelete(req.params.comment_id)
    .then(comment => {
      if (!comment) {
        throw { msg: "Comment Not Found", status: 404 };
      } else
        res.status(200).send({
          comment,
          msg: "Comment sucsessfully removed"
        });
    })
    .catch(next);
};

exports.patchCommentVote = (req, res, next) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    {
      $inc: {
        votes: req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : 0
      }
    },
    { new: true }
  )
    .then(comment => {
      if (!comment) {
        throw { msg: "Comment Not Found", status: 404 };
      } else res.status(200).send({ comment });
    })
    .catch(next);
};
