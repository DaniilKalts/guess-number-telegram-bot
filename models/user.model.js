const sequelize = require("../utils/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  chatId: { type: DataTypes.STRING, unique: true },
  userName: { type: DataTypes.STRING, unique: true },
  gamesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrongAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  losses: { type: DataTypes.INTEGER, defaultValue: 0 },
  wins: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = User;
