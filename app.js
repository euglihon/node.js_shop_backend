const path = require("path");
const env = require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");
const multer = require("multer");

const mongoose = require("mongoose");

const session = require("express-session");
const mongoDBSessionStore = require("connect-mongodb-session")(session);

const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");

const mongoDbURI = `mongodb+srv://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@cluster0.9uqk2.mongodb.net/${process.env.DB_MONGO_DATABASE}`;

const app = express();

// create sessions store
const sessionStore = new mongoDBSessionStore({
  uri: mongoDbURI,
  collection: "sessions",
});

// multer file storage configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // file folder
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + "--" + file.originalname); // new file name
  },
});

// multer file filter configuration
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

// add CSRF protection configuration middleware
const csrfProtection = csrf();

// global configuration parameters
app.set("view engine", "pug"); // add template engine
app.set("views", "views"); // add default template folder

// local routes and local func
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// POST routes parsing
app.use(bodyParser.urlencoded({ extended: false }));

// POST routes file parser(html file name == image)
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// load static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// create session
app.use(
  session({
    secret: "mySecretKeyHash",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// protection middleware
app.use(csrfProtection);

// flash-connect messages middleware
app.use(flash());

// add user to request
app.use((req, res, next) => {
  // session user created in auth
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    return next();
  }
});

// add locals templates variables
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// add admin route
app.use("/admin", adminRoutes);

// add shop routes
app.use(shopRoutes);

// add auth routes
app.use(authRoutes);

// add 500 route
app.get("/500", errorController.get500);

// add 404 route
app.use("/", errorController.get404);

// add error redirect
app.use((error, req, res) => {
  res.redirect("/500");
});

// connect mongoDB server
mongoose
  .connect(mongoDbURI)
  .then((result) => app.listen(3000)) // start app
  .catch((error) => console.log(error));
