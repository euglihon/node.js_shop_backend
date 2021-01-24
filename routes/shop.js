const express = require("express");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// route / ==> GET
router.get("/", shopController.getIndex);

// route /products ==> GET
router.get("/products", shopController.getProducts);

// route /products/:id ==> GET
router.get("/products/:id", shopController.getProductDetail);

// route /cart ==> GET   and add isAuthn middleware
router.get("/cart", isAuth, shopController.getCart);

// route /add-to-card ==> POST   and add isAuthn middleware
router.post("/add-to-card", isAuth, shopController.postCart);

// route /cart-delete-item ==> POST   and add isAuthn middleware
router.post("/cart-delete-item", isAuth, shopController.postDeleteCartItem);

// // route /orders ==> GET   and add isAuthn middleware
router.get("/orders", isAuth, shopController.getOrders);

// // route /create-order ==> post   and add isAuthn middleware
router.post("/create-order", isAuth, shopController.postOrders);

module.exports = router;
