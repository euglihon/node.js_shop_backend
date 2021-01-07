const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorController = require("./controllers/error");

// db, models
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

// global configuration parameters
app.set("view engine", "pug"); // add template engine
app.set("views", "views"); // add default template folder

// local routes and local func
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// POST routes parsing
app.use(bodyParser.urlencoded({ extended: false }));

// load static files
app.use(express.static(path.join(__dirname, "public")));

// add user to request object
app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    // add user to request
    req.user = user;
    // next middleware
    next();
  });
});

// add admin route
app.use("/admin", adminRoutes);

// add shop routes
app.use(shopRoutes);

// add 404 route
app.use("/", errorController.get404);

// add models relation
// one to many
User.hasMany(Product);
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
// one to one
User.hasOne(Cart);
Cart.belongsTo(User);
// many to many
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// automatic tables creation based on models
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "user1", email: "user1@test.pl" });
    } else {
      return user;
    }
  })
  .then((user) => {
    // create user cart
    return Cart.create({ userId: user.id });
  })
  .then((cart) => {
    // start app
    app.listen(3000);
  })
  .catch((error) => console.log(error));
