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

// route orders ==> GET
router.get("/orders", shopController.getOrders);

// route /checkout ==> GET
router.get("/checkout", shopController.getCheckout);

module.exports = router;
