// config/db.js
const { Sequelize } = require('sequelize');

const db = new Sequelize('blog_management', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

module.exports = db;
