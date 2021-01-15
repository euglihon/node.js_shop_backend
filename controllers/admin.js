const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/admin-product-list.pug", {
        prods: products,
        docTitle: "Admin products list",
        activePath: "/admin/products",
      });
    })
    .catch(() => console.log(error));
};

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product.pug", {
    docTitle: "Add Product",
    activePath: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  // req.body ==> html input form data (edit-product.pug) create product
  const { title, description, price, imageURL } = req.body;

  const product = new Product(
    title,
    description,
    price,
    imageURL,
    null, // null -- id
    req.user._id // userID
  );
  product
    .save()
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

    Product.fetchDetail(productID)
      .then((product) => {
        if (!product) {
          res.redirect("/");
        } else {
          res.render("admin/edit-product.pug", {
            docTitle: `Edit ${product.title}`,
            activePath: "/admin/edit-product",
            editing: Boolean(editParam), // string true to boolean true, js:)
            product: product,
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
  Product.fetchDetail(productID)
    .then((product) => {
      const updateProduct = new Product(
        title,
        description,
        price,
        imageURL,
        productID
      );
      updateProduct.save();
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

  Product.deleteDetail(productID)
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch(() => console.log(error));
};
