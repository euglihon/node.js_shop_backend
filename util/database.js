const env = require("dotenv").config();
const Sequelize = require("sequelize");

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(database, user, password, {
  dialect: "mysql",
  host: host,
});

module.exports = sequelize;
