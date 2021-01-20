const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.find() // mongoose method
    .then((products) => {
      res.render("admin/admin-product-list.pug", {
        prods: products,
        docTitle: "Admin products list",
        activePath: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(() => console.log(error));
};

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product.pug", {
    docTitle: "Add Product",
    activePath: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res) => {
  // req.body ==> html input form data (edit-product.pug) create product
  const { title, description, price, imageURL } = req.body;

  const product = new Product({
    title: title,
    description: description,
    price: price,
    imageURL: imageURL,
    userID: req.user._id,
  });
  product
    .save() // mongoose method
    .then((result) => {
      console.log("product created");
      res.redirect("/products");
    })
    .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res) => {
  //  req.query ==>  ?edit=true   true or false
  const editParam = req.query.edit;

  if (!editParam) {
    res.redirect("/");
  } else {
    // req.params.productID ==> GET url params /edit-product/:productID
    const productID = req.params.productID;

    Product.findById(productID) // mongoose method
      .then((product) => {
        if (!product) {
          res.redirect("/");
        } else {
          res.render("admin/edit-product.pug", {
            docTitle: `Edit ${product.title}`,
            activePath: "/admin/edit-product",
            editing: Boolean(editParam), // string true to boolean true, js:)
            product: product,
            isAuthenticated: req.session.isLoggedIn,
          });
        }
      })
      .catch((error) => console.log(error));
  }
};

exports.postEditProduct = (req, res) => {
  // productID -- edit-product.pug updateProduct button
  const productID = req.body.productID;

  // req.body ==> html input form data (edit-product.pug) update product
  const { title, description, price, imageURL } = req.body;

  // update product
  Product.findById(productID) // mongoose method
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageURL = imageURL;
      product.userID = req.user;

      return product.save(); // mongoose method
    })
    .then((result) => {
      console.log("updated product");
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res) => {
  // productID -- delete product ID post request from admin product list
  const productID = req.body.productID;

  Product.findById(productID) // mongoose method
    .then((product) => {
      return product.remove(); // mongoose method
    })
    .then((result) => {
      console.log("product deleted !");
      res.redirect("/admin/products");
    })
    .catch(() => console.log(error));
};
