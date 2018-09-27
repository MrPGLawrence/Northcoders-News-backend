const apiRouter = require("express").Router();
const usersRouter = require("./users");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");

apiRouter.get("/", (req, res) => {
  res.send({ Message: "API" });
});

apiRouter.use("/users", usersRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
