const env = require("dotenv").config();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoUser = process.env.DB_MONGO_USER;
const mongoPassword = process.env.DB_MONGO_PASSWORD;
const mongoDatabase = process.env.DB_MONGO_DATABASE;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.9uqk2.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("[!] ---- connected mongoDB ---- [!]");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "no database fount!!!";
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
