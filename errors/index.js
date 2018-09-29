exports.handle400Params = (err, req, res, next) => {
  if (err.name === "CastError")
    res.status(400).send({ msg: err.msg || "Bad request, Invalid Parameter" });
  else next(err);
};

exports.handle400Post = (err, req, res, next) => {
  if (err.name === "ValidationError")
    res.status(400).send({ msg: err.msg || "Bad request, Invalid Post" });
  else next(err);
};

exports.handle404s = (err, req, res, next) => {
  if (err.status === 404 || err.code === 0)
    res.status(404).send({ msg: err.msg || "Page not found" });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
