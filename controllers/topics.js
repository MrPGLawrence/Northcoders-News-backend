const { Topic, Article } = require("../models");

exports.getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

exports.getArticlesOnTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug }, "-__v")
    .populate("created_by")
    .then(articles => {
      if (!articles) {
        throw { msg: "Article Not Found", status: 404 };
      } else res.send({ articles });
    })
    .catch(next);
};

exports.postArticleOnTopic = (req, res, next) => {
  Article.save(new Article(req.body))
    .then(newArticle => {
      res.status(201).send(newArticle);
    })
    .catch(next);
};
