// models/Blog.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./User');

const Blog = db.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }},
  {
    timestamps: true
  }
);

Blog.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Blog, {foreignKey: 'userId'});

module.exports = Blog;
