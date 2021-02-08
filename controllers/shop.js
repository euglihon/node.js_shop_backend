const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

const pdfkit = require("pdfkit");

//pagination params
const ITEMS_PER_PAGE = 1;

exports.getIndex = (req, res) => {
  res.render("shop/index.pug", {
    docTitle: "Index Page",
    activePath: "/",
  });
};

exports.getProducts = (req, res) => {
  //add pagination
  const page = Number(req.query.page) || 1; // '/?page=__' product-list.pug
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then((sumProducts) => {
      totalItems = sumProducts;
      return Product.find() // mongoose method
        .skip((page - 1) * ITEMS_PER_PAGE) // pagination find param
        .limit(ITEMS_PER_PAGE); // pagination page
    })

    .then((products) => {
      res.render("shop/product-list.pug", {
        prods: products,
        docTitle: "Products list",
        activePath: "/products",
        isAuthenticated: req.session.isLoggedIn,
        // pagination param
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postDeleteCartItem = (req, res) => {
  const productID = req.body.productID;
  req.user
    .removeCartItem(productID) // User model method
    .then((result) => res.redirect("/cart"))
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
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
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderID = req.params.orderID;

  Order.findById(orderID)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userID.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized!"));
      }

      const invoiceName = "invoice-" + orderID + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // create PDF file
      const pdfDocument = new pdfkit();
      res.setHeader("Content-Type", "application/pdf");
      pdfDocument.pipe(fs.createWriteStream(invoicePath));
      pdfDocument.pipe(res);

      // pdf file body
      pdfDocument.fontSize(24).text("Invoice");
      pdfDocument.fontSize(18).text("------------");

      let totalPrice = 0;

      order.products.forEach((product) => {
        totalPrice = totalPrice + product.quantity * product.product.price;
        pdfDocument
          .fontSize(12)
          .text(
            product.product.title +
              " - " +
              product.quantity +
              " x " +
              "$" +
              product.product.price
          );
      });
      pdfDocument.fontSize(18).text("------------");
      pdfDocument.fontSize(18).text("total price: $: " + totalPrice);

      pdfDocument.end();
    })

    .catch((error) => next(error));
};
