const express = require("express");
const { check, body } = require("express-validator/check");

const User = require("../models/user");

const authController = require("../controllers/auth");
const router = express.Router();

// route ==> /login ==> GET
router.get("/login", authController.getLogin);

// route ==> /login ==> POST
router.post(
  "/login",
  // add check validation middleware
  [
    check("email")
      .isEmail()
      .withMessage("Invalid Email address")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password is too short")
      .isAlphanumeric()
      .trim()
      .withMessage("Password can consist of numbers and letters"),
  ],
  authController.postLogin
);

// route ==> /logout ==> POST
router.post("/logout", authController.postLogout);

// route ==> /signup ==> GET
router.get("/signup", authController.getSignup);

// route ==> /signup ==> POST.
router.post(
  "/signup",
  // add check validation middleware
  [
    check("email")
      .isEmail()
      .withMessage("Invalid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long ")
      .isAlphanumeric()
      .trim()
      .withMessage("Password can consist of numbers and letters"),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],
  authController.postSignup
);

// route ==> /reset-password ==> GET
router.get("/reset-password", authController.getResetPassword);

// route ==> /reset-password ==> POST
router.post("/reset-password", authController.postResetPassword);

// route ==> /reset-password/:token ==> GET
router.get("/reset-password/:token", authController.getNewPassword);

// route ==> /new-password ==> POST
router.post("/new-password", authController.postNewPassword);

module.exports = router;
