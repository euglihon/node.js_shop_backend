const express = require('express');


const router = express.Router();


const products = [];


// /admin/add-product ==> GET
router.get('/add-product', (req, res) => {
    res.render('add-product.pug', {
        docTitle: 'Add Product', 
        activePath: '/admin/add-product' // activePath ==> added class 'active' to main-layout
    }); 
}); 

// /admin/add-product ==> POST
router.post('/add-product', (req, res) => {
    // req.body.title ==> html input form data 
    products.push(
        {title: req.body.title},
    );
    res.redirect('/');
    console.log(products)
}); 


exports.routes = router;
exports.products = products;