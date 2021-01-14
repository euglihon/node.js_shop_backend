const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class Product {
  constructor(title, price, description, imageURL) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
  }

  save() {
    const db = getDB();
    return db.collection("products").insertOne(this);
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => console.log(error));
  }

  static fetchDetail(productID) {
    const db = getDB();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectID(productID) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((error) => console.log(error));
  }
}

module.exports = Product;
