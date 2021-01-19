const path = require("path");
const env = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const session = require("express-session");
const mongoDBSessionStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const mongoDbURI = `mongodb+srv://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@cluster0.9uqk2.mongodb.net/${process.env.DB_MONGO_DATABASE}`;

const app = express();

// create sessions store
const sessionStore = new mongoDBSessionStore({
  uri: mongoDbURI,
  collection: "sessions",
});

// global configuration parameters
app.set("view engine", "pug"); // add template engine
app.set("views", "views"); // add default template folder

// local routes and local func
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// POST routes parsing
app.use(bodyParser.urlencoded({ extended: false }));

// load static files
app.use(express.static(path.join(__dirname, "public")));

// create session
app.use(
  session({
    secret: "mySecretKeyHash",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// add admin route
app.use("/admin", adminRoutes);

// add shop routes
app.use(shopRoutes);

// add auth routes
app.use(authRoutes);

// add 404 route
app.use("/", errorController.get404);

// connect mongoDB server
mongoose
  .connect(mongoDbURI)
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
