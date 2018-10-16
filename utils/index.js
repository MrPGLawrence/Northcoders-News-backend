const NODE_ENV = process.env.NODE_ENV || "test";

const {
  userData,
  topicData,
  articleData,
  commentData
} = require(`../seed/${NODE_ENV}Data`);

exports.formatUserData = () => {
  return userData.map(user => {
    return { ...user };
  });
};

exports.formatTopicData = () => {
  return topicData.map(topic => {
    return { ...topic };
  });
};

exports.formatArticleData = (userDocs, topicDocs) => {
  return articleData.map(article => {
    return {
      ...article,
      belongs_to: topicDocs.find(topic => topic.slug === article.topic).slug,
      created_by: userDocs.find(user => user.username === article.created_by)
        ._id
    };
  });
};

exports.formatCommentData = (userDocs, articleDocs) => {
  return commentData.map(comment => {
    return {
      ...comment,
      belongs_to: articleDocs.find(
        article => article.title === comment.belongs_to
      )._id,
      created_by: userDocs.find(user => user.username === comment.created_by)
        ._id
    };
  });
};
