const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");

exports.getIndex = (req, res) => {
  res.render("shop/index.pug", {
    docTitle: "Index Page",
    activePath: "/",
  });
};

exports.getProducts = (req, res) => {
  // findAll -> sequelize basic method -- Select * FROM table_name --
  Product.findAll()
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

  // findByPk -> sequelize basic method -- Select * FROM table_name WHERE id = productID --
  Product.findByPk(productID)
    .then((product) => {
      res.render("shop/product-detail.pug", {
        product: product,
        docTitle: product.title,
        activePath: "/products",
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res) => {
  // request object user
  req.user
    .getCart()
    .then((cart) => {
      // getCart -> magic sequelize method
      return cart.getProducts().then((products) => {
        res.render("shop/cart.pug", {
          docTitle: "Your Cart",
          activePath: "/cart",
          products: products,
        });
      });
    })
    .catch((error) => console.log(error));
};

exports.postCart = (req, res) => {
  //  productID - post params --> /cart
  const productID = req.body.productID;

  let fetchedCart;
  let newQuality = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productID } });
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuality = oldQuantity + 1;
        return product;
      } else {
        return Product.findByPk(productID);
      }
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuality },
      });
    })

    .then(() => {
      res.redirect("/cart");
    })

    .catch((error) => console.log(error));
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
