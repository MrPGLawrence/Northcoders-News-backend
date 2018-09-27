const { Comment } = require("../models");

exports.deleteComment = (req, res, next) => {
  Comment.remove({ _id: req.params._id })
    .then(comment => {
      res.send({ comment });
    })
    .catch(next);
};
