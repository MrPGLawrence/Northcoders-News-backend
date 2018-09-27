const { Article, Comment } = require("../models");

exports.getAllArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  Article.findById(req.params.article_id, "-__v")
    .populate("created_by")
    .then(article => {
      if (!article) {
        throw { msg: "Article Not Found", status: 404 };
      } else res.send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  Article.findById(req.params.article_id, "-__v")
    .populate("created_by")
    .then(article => {
      if (!article) {
        throw { msg: "Article Not Found", status: 404 };
      } else
        return Comment.find({ belongs_to: req.params.article_id }, "-__v")
          .populate("created_by", "-__v")
          .populate("belongs_to", "-__v");
    })
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
