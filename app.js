const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const errorController = require("./controllers/error");
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
  User.findById("60048824c6ff2d4701ae7453").then((user) => {
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
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@cluster0.9uqk2.mongodb.net/${process.env.DB_MONGO_DATABASE}?retryWrites=true&w=majority`
  )
  .then((result) => {
    User.findOne() // mongoose method
      .then((user) => {
        if (!user) {
          // create test user
          const user = new User({
            name: "user1",
            email: "testUser@shop.com",
            cart: {
              items: [],
            },
          });
          user.save(); // mongoose method
        }
        // start app
        app.listen(3000);
      });
  })
  .catch((error) => console.log(error));
