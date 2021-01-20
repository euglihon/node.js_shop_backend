const User = require("../models/user");

exports.getLogin = (req, res) => {
  // loggedIn=true ==> true
  res.render("auth/login.pug", {
    activePath: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res) => {
  User.findById("60048824c6ff2d4701ae7453")
    .then((user) => {
      // add user to session
      req.session.user = user;
      // new session variable
      req.session.isLoggedIn = true;
      req.session.save((error) => {
        console.log(error);
        res.redirect("/");
      });
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
