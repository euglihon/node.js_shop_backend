const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDB();
    db.collection("users").insertOne(this);
  }

  static findById(userID) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectID(userID) });
  }
}

module.exports = User;
