const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAllProducts((products) => {
    res.render("admin/admin-product-list.pug", {
      prods: products,
      docTitle: "Admin products list",
      activePath: "/admin/products",
    });
  });
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
  // create model element
  const product = new Product(null, title, description, price, imageURL); //null --> id element
  product
    .save() // class method, push product to DB
    .then(() => res.redirect("/products"))
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
    Product.fetchProductDetail(productID, (product) => {
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
    });
  }
};

exports.postEditProduct = (req, res) => {
  // productID -- edit-product.pug updateProduct button
  const productID = req.body.productID;
  // req.body ==> html input form data (edit-product.pug) update product
  const { title, description, price, imageURL } = req.body;
  // update product
  const updateProduct = new Product(
    productID,
    title,
    description,
    price,
    imageURL
  );
  // save product
  updateProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res) => {
  // productID -- delete product ID post request from admin product list
  const productID = req.body.productID;
  Product.deleteProduct(productID);
  res.redirect("/admin/products");
};
