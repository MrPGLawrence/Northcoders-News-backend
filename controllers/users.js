const { User } = require("../models");

exports.getAllUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  User.findOne(req.params, "-__v")
    .populate("created_by")
    .then(user => {
      if (!user) {
        throw { msg: "User Not Found", status: 404 };
      } else res.send({ user });
    })
    .catch(next);
};
