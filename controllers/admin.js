const Product = require("../models/product");

const { validationResult } = require("express-validator/check");

//pagination params
const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res) => {
  //add pagination
  const page = Number(req.query.page) || 1; // '/?page=__' product-list.pug
  let totalItems = 0;

  Product.find({ userID: req.user._id }) // mongoose method
    .countDocuments()
    .then((sumProducts) => {
      totalItems = sumProducts;
      return Product.find({ userID: req.user._id })
        .skip((page - 1) * ITEMS_PER_PAGE) // pagination find param
        .limit(ITEMS_PER_PAGE); // pagination page
    })

    .then((products) => {
      res.render("admin/admin-product-list.pug", {
        prods: products,
        docTitle: "Admin products list",
        activePath: "/admin/products",
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

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product.pug", {
    docTitle: "Add Product",
    activePath: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res) => {
  // req.body ==> html input form data (edit-product.pug) create product
  const { title, description, price } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(422).render("admin/edit-product.pug", {
      docTitle: "Add Product",
      activePath: "/admin/add-product",
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      product: {
        title: title,
        description: description,
        price: price,
      },
      hasError: true,
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }

  // add validation
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return res.status(422).render("admin/edit-product.pug", {
      docTitle: "Add Product",
      activePath: "/admin/add-product",
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      product: {
        title: title,
        description: description,
        price: price,
      },
      hasError: true,
      errorMessage: validationError.array()[0].msg,
      validationErrors: validationError.array(),
    });
  }

  // add image server path
  const imageURL = imageFile.path;

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
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
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
            docTitle: `Edit product`,
            activePath: "/admin/edit-product",
            editing: Boolean(editParam), // string true to boolean true, js:)
            product: product,
            isAuthenticated: req.session.isLoggedIn,
            hasError: false,
            errorMessage: null,
            validationErrors: [],
          });
        }
      })
      .catch((error) => {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
      });
  }
};

exports.postEditProduct = (req, res) => {
  // productID -- edit-product.pug updateProduct button
  const productID = req.body.productID;

  // req.body ==> html input form data (edit-product.pug) update product
  const { title, description, price } = req.body;

  const imageFile = req.file;

  // add validation
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return res.status(422).render("admin/edit-product.pug", {
      docTitle: "Edit Product",
      activePath: "/admin/edit-product",
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      product: {
        title: title,
        description: description,
        price: price,
      },
      hasError: true,
      errorMessage: validationError.array()[0].msg,
      validationErrors: validationError.array(),
    });
  }

  // update product
  Product.findById(productID) // mongoose method
    .then((product) => {
      if (product.userID.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = title;
      product.price = price;
      product.description = description;
      product.userID = req.user;
      if (imageFile) {
        product.imageURL = imageFile.path;
      }

      return product.save().then((result) => {
        console.log("updated product");
        res.redirect("/admin/products");
      });
    })

    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};

exports.postDeleteProduct = (req, res) => {
  // productID -- delete product ID post request from admin product list
  const productID = req.body.productID;

  Product.deleteOne({ _id: productID, userID: req.user._id })
    .then((result) => {
      console.log("product deleted !");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      const err = new Error(error);
      err.httpStatusCode = 500;
      return next(err);
    });
};
