const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res) => {
  // loggedIn=true ==> true
  res.render("auth/login.pug", {
    activePath: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            // add user to session
            req.session.user = user;
            // new session variable
            req.session.isLoggedIn = true;
            // save session
            return req.session.save((error) => {
              // console.log(error);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup.pug", {
    activePath: "/signup",
    docTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
