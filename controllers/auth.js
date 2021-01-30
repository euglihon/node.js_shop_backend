const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const { validationResult } = require("express-validator/check");

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

    oldInputData: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  // add validation
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return res.status(422).render("auth/login.pug", {
      activePath: "/login",
      errorMessage: validationError.array()[0].msg, // flash message validation errors,

      oldInputData: { email: email, password: password },
      validationErrors: validationError.array(),
    });
  }

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

    oldInputData: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.postSignup = (req, res) => {
  const { email, password } = req.body;

  // add validation
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return res.status(422).render("auth/signup.pug", {
      activePath: "/signup",
      docTitle: "Signup",
      errorMessage: validationError.array()[0].msg, // flash message validation errors

      oldInputData: { email: email, password: password },
      validationErrors: validationError.array(),
    });
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
        from: "shop@nodeShop.com",
        subject: "Signup succeeded",
        html: "<h1>You successfully signed up</h1>",
      });
    })
    .catch((err) => console.log(err));
};

exports.getResetPassword = (req, res) => {
  //flash message
  let message = req.flash("reset-password-error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset-password.pug", {
    activePath: "/reset-password",
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res) => {
  const email = req.body.email;

  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("reset-password-error", "No account with that email found");
          return res.redirect("/reset-password");
        }

        user.resetToken = token;
        user.resetTokenDate = Date.now() + 3600000;

        return user.save();
      })
      .then((result) => {
        //
        console.log(`http://localhost:3000/reset-password/${token}`);
        //

        res.redirect("/");
        // transporter.sendMail({
        //   to: req.body.email,
        //   from: "shop@nodeShop.com",
        //   subject: "Password reset",
        //   html: `
        //   <p>You requested a password reset</p>
        //   <p>Click this link
        //     <a href="http://localhost:3000/reset-password/${token}">link</a>
        //   to set a new password</p>
        //   `,
        // });
      })
      .catch((error) => console.log(error));
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenDate: { $gt: Date.now() } })
    .then((user) => {
      //flash message
      let message = req.flash("reset-password-error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render("auth/new-password.pug", {
        activePath: "/new-password",
        errorMessage: message,
        userID: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((error) => console.log(error));
};

exports.postNewPassword = (req, res) => {
  //input params new-password.pug
  const newPassword = req.body.password;
  const userID = req.body.userID;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({
    _id: userID,
    resetToken: passwordToken,
    resetTokenDate: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenDate = undefined;
      resetUser.save();
    })
    .then((result) => {
      return res.redirect("/login");
    })
    .catch((error) => console.log(error));
};
