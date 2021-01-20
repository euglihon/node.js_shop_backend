const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

exports.getIndex = (req, res) => {
  res.render("shop/index.pug", {
    docTitle: "Index Page",
    activePath: "/",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getProducts = (req, res) => {
  Product.find() // mongoose method
    .then((products) => {
      res.render("shop/product-list.pug", {
        prods: products,
        docTitle: "Products list",
        activePath: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => console.log(error));
};

exports.getProductDetail = (req, res) => {
  //  id - get url params --> /products/:id
  const productID = req.params.id;

  Product.findById(productID) // mongoose method
    .then((product) => {
      res.render("shop/product-detail.pug", {
        product: product,
        docTitle: "product.title",
        activePath: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productID") // population relation, get products User --> Product

    .execPopulate() // exit population operation
    .then((user) => {
      const products = user.cart.items;

      res.render("shop/cart.pug", {
        docTitle: "Your Cart",
        activePath: "/cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => console.log(error));
};

exports.postCart = (req, res) => {
  //  productID - post params --> /cart
  const productID = req.body.productID;

  Product.findById(productID) //mongoose method
    .then((product) => {
      // req.user -- User model object
      return req.user.addToCart(product); // User model method
    })
    .then((result) => res.redirect("/cart"))
    .catch((error) => console.log(error));
};

exports.postDeleteCartItem = (req, res) => {
  const productID = req.body.productID;
  req.user
    .removeCartItem(productID) // User model method
    .then((result) => res.redirect("/cart"))
    .catch((error) => console.log(error));
};

exports.postOrders = (req, res) => {
  req.user
    .populate("cart.items.productID")
    .execPopulate()
    .then((user) => {
      return user.cart.items.map((product) => {
        return {
          quantity: product.quantity,
          product: { ...product.productID },
        };
      });
    })
    .then((updateProducts) => {
      const order = new Order({
        products: updateProducts,
        user: {
          email: req.user.email,
          userID: req.user._id,
        },
      });
      return order.save();
    })
    .then((result) => req.user.clearCart())
    .then((result) => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userID": req.user._id })
    .then((orders) => {
      res.render("shop/orders.pug", {
        docTitle: "Your orders",
        activePath: "/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => console.log(error));
};
