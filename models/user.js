const mongoose = require("mongoose");
const Product = require("./product");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // relation
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // search for existing products in the cart
  const cartProductIndex = this.cart.items.findIndex(
    (item) => item.productID.toString() === product._id.toString()
  );

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productID: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  this.save();
};

module.exports = mongoose.model("User", userSchema);

// getCart() {
//   const db = getDB();

//   const productIDS = this.cart.items.map((item) => {
//     return item.productID;
//   });

//   return db
//     .collection("products")
//     .find({ _id: { $in: productIDS } })
//     .toArray()
//     .then((products) => {
//       return products.map((product) => {
//         return {
//           ...product,
//           quantity: this.cart.items.find(
//             (item) => item.productID.toString() === product._id.toString()
//           ).quantity,
//         };
//       });
//     });
// }
/*
const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // {items: [ {productID: '', quantity: ''}, ]
    this._id = id ? mongodb.ObjectID(id) : null;
  }

  addToCart(product) {
    // search for existing products in the cart
    const cartProductIndex = this.cart.items.findIndex(
      (item) => item.productID.toString() === product._id.toString()
    );

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productID: new mongodb.ObjectID(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDB();
    db.collection("users").updateOne(
      { _id: this._id },
      { $set: { cart: updatedCart } }
    );
  }

  getCart() {
    const db = getDB();

    const productIDS = this.cart.items.map((item) => {
      return item.productID;
    });

    return db
      .collection("products")
      .find({ _id: { $in: productIDS } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productID.toString() === product._id.toString()
            ).quantity,
          };
        });
      });
  }

  deleteCartItem(productID) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productID.toString() !== productID.toString();
    });
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  getOrders() {
    const db = getDB();
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }

  addOrder() {
    const db = getDB();

    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
            email: this.email,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      });
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
*/
