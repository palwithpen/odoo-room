const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  "odoo",
  "postgres",
  "postgres",
  {
    host: "192.168.1.11",
    port: 31431,
    dialect: "postgres",
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.room = require('../model/room')(sequelize, DataTypes);
db.user = require('../model/user')(sequelize, DataTypes);

module.exports = db;
