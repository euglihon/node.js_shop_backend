const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res) => {
  res.render("shop/index.pug", {
    docTitle: "Index Page",
    activePath: "/", // activePath -- added class 'active' to layout.pug
  });
};

exports.getProducts = (req, res) => {
  // fetchAllProducts -- static model method (callback method!!) ==> return all products
  Product.fetchAllProducts((products) => {
    res.render("shop/product-list.pug", {
      prods: products,
      docTitle: "Products list",
      activePath: "/products", // activePath -- added class 'active' to layout.pug
    });
  });
};

exports.getProductDetail = (req, res) => {
  //  id - get url params --> /products/:id
  const productID = req.params.id;
  Product.fetchProductDetail(productID, (product) => {
    res.render("shop/product-detail.pug", {
      product: product,
      docTitle: product.title,
      activePath: "/products", // activePath -- added class 'active' to layout.pug
    });
  });
};

exports.getCart = (req, res) => {
  res.render("shop/cart.pug", {
    docTitle: "Your Cart",
    activePath: "/cart", // activePath -- added class 'active' to layout.pug
  });
};

exports.postCart = (req, res) => {
  //  id - post params --> /cart
  const productID = req.body.id;
  // add product to cart
  Product.fetchProductDetail(productID, (product) => {
    Cart.addProduct(productID, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res) => {
  res.render("shop/orders.pug", {
    docTitle: "Your orders",
    activePath: "/orders", // activePath -- added class 'active' to layout.pug
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout.pug", {
    docTitle: "Checkout",
    activePath: "/checkout", // activePath -- added class 'active' to layout.pug
  });
};
