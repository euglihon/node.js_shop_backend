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

  // create model element
  const product = new Product(title, description, price, imageURL);

  product.save().then((result) => {
    console.log("product created");
  });

  //   // create -> sequelize basic method -- INSERT INTO () VALUES () --
  //   Product.create({
  //     id: null,
  //     title: title,
  //     description: description,
  //     price: price,
  //     imageURL: imageURL,
  //     userId: req.user.id, // add request object user
  //   })
  //     .then(() => {
  //       console.log("product is created");
  //       res.redirect("/products");
  //     })
  //     .catch((error) => console.log(error));
};

// exports.getEditProduct = (req, res) => {
//   //  req.query ==>  ?edit=true   true or false
//   const editParam = req.query.edit;

//   if (!editParam) {
//     res.redirect("/");
//   } else {
//     // req.params.productID ==> GET url params /edit-product/:productID
//     const productID = req.params.productID;

//     // findByPk -> sequelize basic method -- Select * FROM table_name WHERE id = productID --
//     Product.findByPk(productID)
//       .then((product) => {
//         if (!product) {
//           res.redirect("/");
//         } else {
//           res.render("admin/edit-product.pug", {
//             docTitle: `Edit ${product.title}`,
//             activePath: "/admin/edit-product",
//             editing: Boolean(editParam), // string true to boolean true, js:)
//             product: product,
//           });
//         }
//       })
//       .catch((error) => console.log(error));
//   }
// };

exports.postEditProduct = (req, res) => {
  // productID -- edit-product.pug updateProduct button
  const productID = req.body.productID;

  // req.body ==> html input form data (edit-product.pug) update product
  const { title, description, price, imageURL } = req.body;

  // update product
  // findByPk -> sequelize basic method -- Select * FROM table_name WHERE id = productID --
  Product.findByPk(productID)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageURL = imageURL;
      // save -> sequelize push method.     return promise
      return product.save();
    })
    .then((result) => {
      console.log("updated product");
      // redirect
      res.redirect("/admin/products");
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res) => {
  // productID -- delete product ID post request from admin product list
  const productID = req.body.productID;

  // findByPk -> sequelize basic method -- Select * FROM table_name WHERE id = productID --
  Product.findByPk(productID)
    .then((product) => {
      // sequelize delete record
      return product.destroy();
    })
    .then((result) => {
      console.log("product deleted");
      res.redirect("/admin/products");
    })
    .catch(() => console.log(error));
};
