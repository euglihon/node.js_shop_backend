const Product = require('../models/product');


exports.getProducts = (req, res) => {
    Product.fetchAllProducts( (products) => {
        res.render('admin/admin-product-list.pug', {
            prods: products,
            docTitle: 'Admin products list', 
            activePath: '/admin/products' // activePath -- added class 'active' to layout.pug
        });
    });
};


exports.getAddProduct = (req, res) => {
    res.render('admin/add-product.pug', {
        docTitle: 'Add Product', 
        activePath: '/admin/add-product' // activePath -- added class 'active' to layout.pug
    });
};

exports.postAddProduct = (req, res) => {
    // req.body ==> html input form data (add-product.pug)
    const { title, description, price, imageURL } = req.body;
    // create model element
    const product = new Product(title, description, price, imageURL); 
    product.save();   // class method, push product to DB
    res.redirect('/products');
};