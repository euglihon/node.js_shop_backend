const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// route ==> /login ==> GET
router.get("/login", authController.getLogin);

// route ==> /login ==> POST
router.post("/login", authController.postLogin);

module.exports = router;
