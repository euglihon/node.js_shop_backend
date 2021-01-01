const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch previous cart items
    fs.readFile(filePath, (error, fileBody) => {
      // create new cart
      let cart = { products: [], totalPrice: 0 };

      // parse cart file, imitation DB
      if (!error) {
        cart = JSON.parse(fileBody);
      }

      // analyze cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      // create new product array
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quality = updatedProduct.quality + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // create new product
        updatedProduct = { id: id, quality: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      // add total price
      cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);

      // write new cart to file, imitation DB
      fs.writeFile(filePath, JSON.stringify(cart), (error) => {
        console.log(error);
      });
    });
  }
};
