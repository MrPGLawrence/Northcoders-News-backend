const app = require("express")();
const apiRouter = require("./routes/api.js");
const mongoose = require("mongoose");
const { DB_URL } = require("./config");
const { handle400s, handle404s, handle500s } = require("./errors");

mongoose.connect(DB_URL).then(() => {
  console.log(`Connected to ${DB_URL}...`);
});

app.get("/", (req, res) => {
  res.send({ Message: "Home Page" });
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404, msg: "Resource not found" });
});

app.use(handle400s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
