const { Article, Comment } = require("../models");

const getCommentCount = articles => {
  return articles.map(article => {
    return Comment.countDocuments({ belongs_to: article._id });
  });
};

exports.getAllArticles = (req, res, next) => {
  Article.find(null, "-__v")
    .then(articles => {
      return Promise.all([articles, ...getCommentCount(articles)]);
    })
    .then(([articles, ...commentCount]) => {
      return Promise.all([
        articles.map((article, index) => {
          return {
            ...article._doc,
            comment_count: commentCount[index]
          };
        })
      ])
        .then(([articles]) => {
          res.status(200).send({ articles });
        })
        .catch(next);
    });
};

exports.getArticleById = (req, res, next) => {
  Comment.count({ belongs_to: req.params.article_id })
    .then(commentCount => {
      // if (!commentCount || commentCount < 0) {
      //   throw { status: 404 };
      // } else
      return Promise.all([
        Article.findById(req.params.article_id, "-__v").populate("created_by"),
        commentCount
      ]);
    })
    .then(([articleOne, commentCount]) => {
      const article = { ...articleOne._doc, comment_count: commentCount };
      if (!article) {
        throw { msg: "Article Not Found", status: 404 };
      } else res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  Article.findById(req.params.article_id, "-__v")
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

exports.postCommentOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  newComment.belongs_to = article_id;
  return Article.findOne({ _id: article_id }, "-__v")
    .then(commentMatch => {
      if (!commentMatch) {
        throw { msg: "Article Not Found", status: 404 };
      } else return Comment.create(newComment);
    })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVote = (req, res, next) => {
  Article.findByIdAndUpdate(
    req.params.article_id,
    {
      $inc: {
        votes: req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : 0
      }
    },
    { new: true }
  )
    .then(article => {
      if (!article) {
        throw { msg: "Article Not Found", status: 404 };
      } else res.status(200).send({ article });
    })
    .catch(next);
};
