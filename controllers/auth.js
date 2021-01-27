const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

// init email server transporter
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res) => {
  //flash message
  let message = req.flash("login-error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login.pug", {
    activePath: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // flash message
        req.flash("login-error", "Invalid email or password");

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
          // flash message
          req.flash("login-error", "Invalid email or password");
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
  //flash message
  let message = req.flash("signup-error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup.pug", {
    activePath: "/signup",
    docTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  console.log(process.env.SENDGRID_API_KEY);

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        // flash message
        req.flash("signup-error", "Email already exists");
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
          // send email
          return transporter.sendMail({
            to: email,
            from: "shop@node-shop.com",
            subject: "Signup succeeded",
            html: "<h1>You successfully signed up</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
