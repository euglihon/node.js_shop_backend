const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");
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
  User.findById("6001edb97d49a2792f8764c7").then((user) => {
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

// connect mongoDB server
mongoConnect(() => {
  // run app
  app.listen(3000);
});
