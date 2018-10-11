process.env.NODE_ENV = "test";
const { expect } = require("chai");
const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const {
  userData,
  topicData,
  articleData,
  commentData
} = require("../seed/testData");

describe("/api", function() {
  let userDocs, topicDocs, articleDocs, commentDocs;
  beforeEach(() => {
    return seedDB({
      userData,
      topicData,
      articleData,
      commentData
    }).then(docs => {
      [userDocs, topicDocs, articleDocs, commentDocs] = docs;
    });
  });
  after(() => {
    return mongoose.disconnect();
  });
  describe("/articles", () => {
    it("GET returns 200 and an array of articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { updatedArticles } }) => {
          expect(updatedArticles).to.be.an("array");
          expect(updatedArticles.length).to.equal(4);
          expect(updatedArticles[0].title).to.equal(articleDocs[0].title);
          expect(updatedArticles[0]._id).to.equal(`${articleDocs[0]._id}`);
          expect(updatedArticles[0].comment_count).to.equal(8);
          expect(updatedArticles[0]).to.have.keys([
            "_id",
            "belongs_to",
            "body",
            "comment_count",
            "created_at",
            "created_by",
            "title",
            "votes"
          ]);
        });
    });
    describe("/articleId", () => {
      it("GET returns 200 and an article object", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.title).to.equal(articleDocs[0].title);
            expect(article._id).to.equal(`${articleDocs[0]._id}`);
            expect(article.comment_count).to.equal(8);
            expect(article).to.have.keys([
              "_id",
              "belongs_to",
              "body",
              "comment_count",
              "created_at",
              "created_by",
              "title",
              "votes"
            ]);
          });
      });
      it("GET returns a 400 for an invalid id", () => {
        return request
          .get("/api/articles/abc")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request, Invalid Parameter");
          });
      });
      it("GET returns a 404 when page not found", () => {
        return request
          .get("/api/articles/5bad03194bdc255761379629")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
          });
      });
      it("PATCH returns 200 and a vote up on an article", () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_at",
              "created_by",
              "title",
              "votes"
            );
            expect(article.votes).to.eql(1);
          });
      });
      it("PATCH returns 200 and a vote up on an article", () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_at",
              "created_by",
              "title",
              "votes"
            );
            expect(article.votes).to.eql(-1);
          });
      });
      it("PATCH returns a 400 for an invalid id", () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=across`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request, Invalid Parameter");
          });
      });
      it("PATCH returns a 404 when page not found", () => {
        return request
          .patch("/api/articles/5bad052fd53e38586a1feb2e?vote=up")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Article Not Found");
          });
      });
      describe("/:articleId/comments", () => {
        it("GET returns 200 and an array of comments", () => {
          return request
            .get(`/api/articles/${articleDocs[0]._id}/comments`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.an("array");
              expect(comments.length).to.equal(8);
              expect(comments[0].title).to.equal(commentDocs[0].title);
              expect(comments[0]._id).to.equal(`${commentDocs[0]._id}`);
              expect(comments[0]).to.have.keys([
                "_id",
                "belongs_to",
                "body",
                "created_at",
                "created_by",
                "votes"
              ]);
            });
        });
        it("GET returns a 404 when page not found", () => {
          return request
            .get(`/api/articles/${articleDocs[0]._id}/coments`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Resource not found");
            });
        });
        it("POST returns 201 and the new added comment", () => {
          const newComment = {
            title: "new comment",
            body: "This is a new comment",
            belongs_to: "5bad052fd53e38586a1feb2e",
            created_by: "5bad052fd53e38586a1feb2a"
          };
          return request
            .post(`/api/articles/${articleDocs[0]._id}/comments`)
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment).to.be.an("object");
              expect(comment).to.have.all.keys(
                "__v",
                "_id",
                "belongs_to",
                "body",
                "created_at",
                "created_by",
                "votes"
              );
            });
        });
        it("POST returns a 400 when a bad request is made", () => {
          const newComment = {
            title: "new comment",
            bod: "This is a new comment",
            belongs_to: "5bad052fd53e38586a1feb2e",
            created_by: "5bad052fd53e38586a1feb2a"
          };
          return request
            .post(`/api/articles/${articleDocs[0]._id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request, Invalid Post");
            });
        });
        it("POST returns a 404 when page not found", () => {
          return request
            .post(`/api/articles/${articleDocs[0]._id}/comnts`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Resource not found");
            });
        });
      });
    });
  });
  describe("/users", () => {
    it("GET returns 200 and an array of users", () => {
      return request
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).to.be.an("array");
          expect(users.length).to.equal(2);
          expect(users[0].name).to.equal(userDocs[0].name);
          expect(users[0]._id).to.equal(`${userDocs[0]._id}`);
          expect(users[0]).to.have.keys([
            "_id",
            "avatar_url",
            "name",
            "username"
          ]);
        });
    });
    describe("/:username", () => {
      it("GET returns 200 and a user object", () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.be.an("object");
            expect(user.name).to.equal(userDocs[0].name);
            expect(user._id).to.equal(`${userDocs[0]._id}`);
            expect(user).to.have.keys([
              "_id",
              "avatar_url",
              "name",
              "username"
            ]);
          });
      });
      it("GET returns a 404 for a username that does not exist", () => {
        return request
          .get("/api/users/dave")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("User Not Found");
          });
      });
    });
  });
  describe("/topics", () => {
    it("GET returns 200 and an array of topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics.length).to.equal(2);
          expect(topics[0].name).to.equal(topicDocs[0].name);
          expect(topics[0]._id).to.equal(`${topicDocs[0]._id}`);
          expect(topics[0]).to.have.keys(["_id", "slug", "title"]);
        });
    });
    describe("/:topic_slug/articles", () => {
      it("GET returns 200 and a article object", () => {
        return request
          .get(`/api/topics/${topicDocs[0].slug}/articles`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles.length).to.equal(4);
            expect(articles[0].name).to.equal(articleDocs[0].name);
            expect(articles[0]._id).to.equal(`${articleDocs[0]._id}`);
            expect(articles[0]).to.have.keys([
              "_id",
              "belongs_to",
              "body",
              "created_at",
              "created_by",
              "title",
              "votes"
            ]);
          });
      });
      it("GET returns a 404 for an invalid id that does not exist", () => {
        return request
          .get(`/api/topics/${topicDocs[0].slug}/article`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Resource not found");
          });
      });
      it("POST returns 201 and the new added article", () => {
        const newArticle = {
          title: "new article",
          body: "This is my new article content",
          created_by: "5bad052fd53e38586a1feb2e"
        };
        return request
          .post(`/api/topics/${topicDocs[0].slug}/articles`)
          .send(newArticle)
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article).to.have.all.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_at",
              "created_by",
              "title",
              "votes"
            );
          });
      });
      it("POST returns a 400 when a bad request is made", () => {
        const newArticle = {
          bod: "This is my new article content",
          created_by: "5bad052fd53e38586a1feb2e"
        };
        return request
          .post(`/api/topics/${topicDocs[0].slug}/articles`)
          .send(newArticle)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request, Invalid Post");
          });
      });
      it("POST returns a 404 when page not found", () => {
        return request
          .post(`/api/topics/${topicDocs[0].slug}/arles`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Resource not found");
          });
      });
    });
  });
  describe("/comments", () => {
    it("GET returns 200 and an array of comments", () => {
      return request
        .get("/api/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.an("array");
          expect(comments.length).to.equal(8);
          expect(comments[0].created_by).to.equal(
            `${commentDocs[0].created_by.id}`
          );
          expect(comments[0]._id).to.equal(`${commentDocs[0].id}`);
          expect(comments[0]).to.have.keys([
            "_id",
            "belongs_to",
            "body",
            "created_at",
            "created_by",
            "votes"
          ]);
        });
    });
    describe("/:comment_id", () => {
      it("GET returns 200 and an comment object", () => {
        return request
          .get(`/api/comments/${commentDocs[0]._id}`)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
            expect(comment.title).to.equal(commentDocs[0].title);
            expect(comment._id).to.equal(`${commentDocs[0]._id}`);
            expect(comment).to.have.keys([
              "_id",
              "belongs_to",
              "body",
              "created_at",
              "created_by",
              "votes"
            ]);
          });
      });
      it("GET returns a 400 for an invalid id", () => {
        return request
          .get("/api/comments/abc")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request, Invalid Parameter");
          });
      });
      it("GET returns a 404 when page not found", () => {
        return request
          .get("/api/comments/5bad03194bdc255761379629")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Comment Not Found");
          });
      });
      it("PATCH returns 200 and a vote up on an comment", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.have.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_at",
              "created_by",
              "votes"
            );
            expect(comment.votes).to.eql(8);
          });
      });
      it("PATCH returns 200 and a vote down on a comment", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.have.keys(
              "__v",
              "_id",
              "belongs_to",
              "body",
              "created_at",
              "created_by",
              "votes"
            );
            expect(comment.votes).to.eql(6);
          });
      });
      it("PATCH returns a 400 for an invalid id", () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=across`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request, Invalid Parameter");
          });
      });
      it("PATCH returns a 404 when page not found", () => {
        return request
          .patch("/api/comments/5bad052fd53e38586a1feb2e?vote=up")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Comment Not Found");
          });
      });
      it("DELETE returns a 200 and deletes a single comment", () => {
        return request
          .delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(200)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Comment sucsessfully removed");
          });
      });
      it("DELETE returns a 400 for an invalid id", () => {
        return request
          .delete("/api/comments/a")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request, Invalid Parameter");
          });
      });
      it("DELETE returns a 404 when page not found", () => {
        return request
          .delete(`/api/comment/${commentDocs[0]._id}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Resource not found");
          });
      });
    });
  });
});
