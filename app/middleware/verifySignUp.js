const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Email is already in use!"
      });
      return;
    }
    next();
  });
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
