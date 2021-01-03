const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

// route ==> /admin/products ==> GET
router.get("/products", adminController.getProducts);

// route ==> /admin/add-product ==> GET
router.get("/add-product", adminController.getAddProduct);

// route ==> /admin/add-product ==> POST
router.post("/add-product", adminController.postAddProduct);

// route ==> /admin/edit-product/:productID ==> GET
router.get("/edit-product/:productID", adminController.getEditProduct);

// route ==> /admin/edit-product ==> POST
router.post("/edit-product", adminController.postEditProduct);

// route ==> /admin/delete-product ==> POST
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
