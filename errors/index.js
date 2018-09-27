exports.handle400s = (err, req, res, next) => {
  if (err.name === "CastError") res.status(400).send({ msg: "Bad request" });
  else next(err);
};

exports.handle404s = (err, req, res, next) => {
  if (err.status === 404 || err.code === 0)
    res.status(404).send({ msg: "Page not found" });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
