const Product = require("../models/product");

exports.getIndex = (req, res) => {
  res.render("shop/index.pug", {
    docTitle: "Index Page",
    activePath: "/",
  });
};

exports.getProducts = (req, res) => {
  Product.find() // mongoose method
    .then((products) => {
      res.render("shop/product-list.pug", {
        prods: products,
        docTitle: "Products list",
        activePath: "/products",
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
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productID") // population relation, get products User --> Product
    .execPopulate() // exit population operation
    .then((user) => {
      // console.log(user.cart.items);

      const products = user.cart.items;

      res.render("shop/cart.pug", {
        docTitle: "Your Cart",
        activePath: "/cart",
        products: products,
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

// exports.postDeleteCartItem = (req, res) => {
//   const productID = req.body.productID;
//   req.user
//     .deleteCartItem(productID)
//     .then((result) => res.redirect("/cart"))
//     .catch((error) => console.log(error));
// };

// exports.getOrders = (req, res) => {
//   req.user
//     .getOrders()
//     .then((orders) => {
//       res.render("shop/orders.pug", {
//         docTitle: "Your orders",
//         activePath: "/orders",
//         orders: orders,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.postOrders = (req, res) => {
//   req.user
//     .addOrder()
//     .then((result) => res.redirect("/orders"))
//     .catch((error) => console.log(error));
// };
