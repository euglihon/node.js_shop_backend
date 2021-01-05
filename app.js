const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");

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

// add admin route
app.use("/admin", adminRoutes);

// add shop routes
app.use(shopRoutes);

// add 404 route
app.use("/", errorController.get404);

// automatic tables creation based on models
sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    // start app
    app.listen(3002);
  })
  .catch((error) => console.log(error));
