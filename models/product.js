const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, description, price, imageURL) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageURL = imageURL;
  }

  // save product to DB
  save() {
    return db.execute(
      "INSERT INTO products (id, title, price, description, imageURL) VALUES (?, ?, ?, ?, ?)",
      [null, this.title, this.price, this.description, this.imageURL]
    );
  }

  static deleteProduct(productID) {}

  // static ==> return all products from db
  static fetchAllProducts() {
    return db.execute(
      "SELECT id, title, price, description, imageURL FROM products"
    );
  }

  // static ==> return one product detail from db
  static fetchProductDetail(productID) {
    return db.execute(
      "SELECT id, title, price, description, imageURL FROM products WHERE products.id = ?",
      [productID]
    );
  }
};
