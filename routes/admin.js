const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();


// route ==> /admin/products ==> GET
router.get('/products', adminController.getProducts);


// route ==> /admin/add-product ==> GET
router.get('/add-product', adminController.getAddProduct);


// route ==> /admin/add-product ==> POST
router.post('/add-product', adminController.postAddProduct);


module.exports = router;