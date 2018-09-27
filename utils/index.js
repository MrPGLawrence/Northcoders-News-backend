const {
  userData,
  topicData,
  articleData,
  commentData
} = require("../seed/testData");

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
      belongs_to: topicDocs.find(topic => topic.slug).slug,
      created_by: userDocs.find(user => user._id)
    };
  });
};

exports.formatCommentData = (userDocs, topicDocs, articleDocs) => {
  return commentData.map(comment => {
    return {
      ...comment,
      belongs_to: articleDocs.find(article => article._id),
      created_by: userDocs.find(user => user._id)
    };
  });
};
