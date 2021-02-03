const express = require("express");
const { check, body } = require("express-validator/check");

const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is-auth");
const router = express.Router();

// route ==> /admin/products ==> GET  and add isAuthn middleware
router.get("/products", isAuth, adminController.getProducts);

// route ==> /admin/add-product ==> GET  and add isAuthn middleware
router.get("/add-product", isAuth, adminController.getAddProduct);

// route ==> /admin/add-product ==> POST
router.post(
  "/add-product",
  // add check validation middleware
  [
    body("title")
      .isString()
      .isLength({ min: 3, max: 140 })
      .trim()
      .withMessage("please enter the correct title"),

    body("description")
      .isString()
      .isLength({ min: 10, max: 300 })
      .trim()
      .withMessage("please enter the correct description"),

    body("price")
      .isFloat()
      .trim()
      .withMessage("please enter the correct price"),
  ],
  // add isAuthn middleware
  isAuth,
  adminController.postAddProduct
);

// route ==> /admin/edit-product/:productID ==> GET
router.get(
  "/edit-product/:productID", // add check validation middleware
  isAuth, // add isAuthn middleware
  adminController.getEditProduct
);

// route ==> /admin/edit-product ==> POST
router.post(
  "/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3, max: 140 })
      .trim()
      .withMessage("please enter the correct title"),

    body("description")
      .isString()
      .isLength({ min: 10, max: 300 })
      .trim()
      .withMessage("please enter the correct description"),

    body("price")
      .isFloat()
      .trim()
      .withMessage("please enter the correct price"),
  ],
  isAuth, // add isAuthn middleware
  adminController.postEditProduct
);

// route ==> /admin/delete-product ==> POST  and add isAuthn middleware
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
