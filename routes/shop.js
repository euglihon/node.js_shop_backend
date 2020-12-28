const express = require('express');


const router = express.Router();


const adminData = require('./admin'); // временно добавляем для массива данных, которые имитируют бд 


// / ==> GET
router.get('/', (req, res) => {
    const products = adminData.products; // данные из имитации бд
    res.render('shop.pug', {
        prods: products, 
        docTitle: 'My Shop', 
        activePath: '/'  // activePath ==> added class 'active' to main-layout
    });       
});


module.exports = router;