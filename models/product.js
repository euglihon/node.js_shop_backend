const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class Product {
  constructor(title, price, description, imageURL, id, userID) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = id ? mongodb.ObjectID(id) : null;
    this.userID = userID;
  }

  save() {
    const db = getDB();
    let dbOperation;

    if (this._id) {
      // Update product
      dbOperation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // save new product
      dbOperation = db.collection("products").insertOne(this);
    }
    return dbOperation;
  }

  static fetchAll() {
    const db = getDB();
    return db.collection("products").find().toArray();
  }

  static fetchDetail(productID) {
    const db = getDB();
    return db
      .collection("products")
      .findOne({ _id: new mongodb.ObjectID(productID) });
  }

  static deleteDetail(productID) {
    const db = getDB();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(productID) });
  }
}

module.exports = Product;
