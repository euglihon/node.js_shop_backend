const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getIndex = (req, res) => {
  res.render("shop/index.pug", {
    docTitle: "Index Page",
    activePath: "/",
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
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

  Product.fetchDetail(productID)
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
    .getCart()
    .then((cart) => {
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

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productID } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((error) => console.log(error));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders.pug", {
        docTitle: "Your orders",
        activePath: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((error) => console.log(error));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((error) => console.log(error));
};
