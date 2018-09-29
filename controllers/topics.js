const { Topic, Article } = require("../models");

exports.getAllTopics = (req, res, next) => {
  Topic.find(null, "-__v")
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticlesOnTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug }, "-__v")
    .populate("created_by", "-__v")
    .then(articles => {
      if (!articles) {
        throw { msg: "Article Not Found", status: 404 };
      } else res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticleOnTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  const newArticle = req.body;
  newArticle.belongs_to = topic_slug;
  return Topic.findOne({ slug: topic_slug }, "-__v")
    .then(articleMatch => {
      if (!articleMatch) {
        throw { msg: "Topic Not Found, cannot post", status: 404 };
      } else return Article.create(newArticle);
    })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
