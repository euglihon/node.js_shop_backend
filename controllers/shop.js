const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res) => {
  res.render("shop/index.pug", {
    docTitle: "Index Page",
    activePath: "/",
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAllProducts((products) => {
    res.render("shop/product-list.pug", {
      prods: products,
      docTitle: "Products list",
      activePath: "/products",
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
      activePath: "/products",
    });
  });
};

exports.getCart = (req, res) => {
  Cart.getProducts((cart) => {
    Product.fetchAllProducts((products) => {
      const cartProducts = [];

      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quality: cartProductData.quality,
          });
        }
      }
      res.render("shop/cart.pug", {
        docTitle: "Your Cart",
        activePath: "/cart",
        products: cartProducts,
      });
    });
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

exports.postDeleteCartItem = (req, res) => {
  const productID = req.body.productID;
  Product.fetchProductDetail(productID, (product) => {
    Cart.deleteProduct(productID, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders.pug", {
    docTitle: "Your orders",
    activePath: "/orders",
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout.pug", {
    docTitle: "Checkout",
    activePath: "/checkout",
  });
};
