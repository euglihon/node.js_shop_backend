const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();

// route / ==> GET
router.get("/", shopController.getIndex);

// route /products ==> GET
router.get("/products", shopController.getProducts);

// route /products/:id ==> GET
router.get("/products/:id", shopController.getProductDetail);

// route /cart ==> GET
router.get("/cart", shopController.getCart);

// route /add-to-card ==> POST
router.post("/add-to-card", shopController.postCart);

// route /cart-delete-item ==> POST
router.post("/cart-delete-item", shopController.postDeleteCartItem);

// route /orders ==> GET
router.get("/orders", shopController.getOrders);

// route /create-order ==> post
router.post("/create-order", shopController.postOrders);

module.exports = router;
