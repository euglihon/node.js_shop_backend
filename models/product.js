const path = require("path");
const fs = require("fs");

const Cart = require("./cart");

const filePath = path.join(__dirname, "..", "data", "products.json"); // path json file

const getProductFromFile = (callback) => {
  fs.readFile(filePath, (error, fileBody) => {
    if (error) {
      callback([]);
    } else {
      callback(JSON.parse(fileBody));
    }
  });
};

module.exports = class Product {
  constructor(id, title, description, price, imageURL) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageURL = imageURL;
  }

  // save new product or edit existing product
  save() {
    getProductFromFile((products) => {
      // product existing
      if (this.id) {
        const exitingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        // update new product data
        updatedProducts[exitingProductIndex] = this;
        // save editing products
        fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
          console.log("write json file error:", error);
        });
      } else {
        // create product id
        this.id = Math.random().toString();
        products.push(this); // this -- push product element
        // write product array to json file
        fs.writeFile(filePath, JSON.stringify(products), (error) => {
          console.log("write json file error:", error);
        });
      }
    });
  }

  static deleteProduct(productID) {
    getProductFromFile((products) => {
      // find product
      const product = products.find((product) => product.id === productID);
      // created new products array
      const updatedProducts = products.filter(
        (product) => product.id !== productID
      );
      // write new product array
      fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
        if (!error) {
          // delete product from cart
          Cart.deleteProduct(productID, product.price);
        } else {
          console.log(error);
        }
      });
    });
  }

  // static ==> return all products from db
  static fetchAllProducts(callback) {
    getProductFromFile(callback);
  }

  // static ==> return one product detail from db
  static fetchProductDetail(id, callback) {
    getProductFromFile((products) => {
      const product = products.find((p) => p.id === id);
      callback(product);
    });
  }
};
