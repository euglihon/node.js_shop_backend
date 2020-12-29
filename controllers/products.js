const Product = require('../models/product');


exports.getProducts = (req, res) => {
    // fetchAllProducts -- static model method (callback method!!) ==> return all products
    Product.fetchAllProducts( (products) => {
        res.render('shop.pug', {
            prods: products, 
            docTitle: 'My Shop', 
            activePath: '/'  // activePath -- added class 'active' to main-layout.pug
        });
    });
};

exports.getAddProduct = (req, res) => {
    res.render('add-product.pug', {
        docTitle: 'Add Product', 
        activePath: '/admin/add-product' // activePath -- added class 'active' to main-layout
    });
};

exports.postAddProduct = (req, res) => {
    // create class element
    // req.body.title ==> html input form data (add-product.pug)
    const product = new Product(req.body.title); 
    product.save();   // class method, push product to DB
    res.redirect('/');
};

