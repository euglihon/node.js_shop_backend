const { error } = require("console");
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

  static deleteProduct(id, productPrice) {
    fs.readFile(filePath, (error, fileBody) => {
      if (error) {
        return;
      }
      // create copy cart
      const updatedCart = { ...JSON.parse(fileBody) };
      // find delete product
      const product = updatedCart.products.find((product) => product.id === id);
      // update copy cart include delete product
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );
      // update price and quality
      const productQuality = product.quality;
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQuality;
      // write new cart object to file
      fs.writeFile(filePath, JSON.stringify(updatedCart), (error) => {
        console.log(error);
      });
    });
  }

  static getProducts(callback) {
    fs.readFile(filePath, (error, fileBody) => {
      const cart = JSON.parse(fileBody);
      if (error) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
};
