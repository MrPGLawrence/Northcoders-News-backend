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
} = require("../seed/testdata");

describe("/api", function() {
  this.timeout(5000);
  let userDocs, topicDocs, articleDocs, commentDocs;
  beforeEach(() => {
    return seedDB({
      userData,
      topicData,
      articleData,
      commentData
    }).then(docs => {
      console.log("seeded...");
      userDocs = docs[0];
      topicDocs = docs[1];
      articleDocs = docs[2];
      commentDocs = docs[3];
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
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("array");
          expect(articles.length).to.equal(4);
          expect(articles[0].title).to.equal(articleDocs[0].title);
          expect(articles[0]._id).to.equal(`${articleDocs[0]._id}`);
          expect(articles[0]).to.have.keys([
            "__v",
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
    describe("/articleId", () => {
      it("GET returns 200 and an article object", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.title).to.equal(articleDocs[0].title);
            expect(article._id).to.equal(`${articleDocs[0]._id}`);
            expect(article).to.have.keys([
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
      it("GET returns a 400 for an invalid id", () => {
        return request
          .get("/api/articles/se65dr76ft7giyutvu")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("GET returns a 404 for an invalid id that does not exist", () => {
        return request
          .get("/api/articles/5bad03194bdc255761379629")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
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
        it("GET returns a 404 for an invalid id that does not exist", () => {
          return request
            .get("/api/articles/5bad03194bdc255761379629/comment")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Page not found");
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
            "__v",
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
      it("GET returns a 404 for an invalid id that does not exist", () => {
        return request
          .get("/api/users/dave")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page not found");
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
          expect(topics[0]).to.have.keys(["__v", "_id", "slug", "title"]);
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
            expect(msg).to.equal("Page not found");
          });
      });
    });
  });
});
