const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// route ==> /admin/products ==> GET  and add isAuthn middleware
router.get("/products", isAuth, adminController.getProducts);

// route ==> /admin/add-product ==> GET  and add isAuthn middleware
router.get("/add-product", isAuth, adminController.getAddProduct);

// route ==> /admin/add-product ==> POST  and add isAuthn middleware
router.post("/add-product", isAuth, adminController.postAddProduct);

// route ==> /admin/edit-product/:productID ==> GET  and add isAuthn middleware
router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

// route ==> /admin/edit-product ==> POST  and add isAuthn middleware
router.post("/edit-product", isAuth, adminController.postEditProduct);

// route ==> /admin/delete-product ==> POST  and add isAuthn middleware
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
