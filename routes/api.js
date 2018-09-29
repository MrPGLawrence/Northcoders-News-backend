const apiRouter = require("express").Router();
const usersRouter = require("./users");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");

apiRouter.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/api.html`);
});

apiRouter.use("/users", usersRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
