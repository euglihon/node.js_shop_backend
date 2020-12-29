const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();


// route / ==> GET
router.get('/', productsController.getProducts);


module.exports = router;