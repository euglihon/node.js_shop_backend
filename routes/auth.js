const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// route ==> /login ==> GET
router.get("/login", authController.getLogin);

// route ==> /login ==> POST
router.post("/login", authController.postLogin);

// route ==> /logout ==> POST
router.post("/logout", authController.postLogout);

// route ==> /signup ==> GET
router.get("/signup", authController.getSignup);

// route ==> /signup ==> POST
router.post("/signup", authController.postSignup);

module.exports = router;
