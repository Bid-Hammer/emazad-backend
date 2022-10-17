"use strict";

module.exports = (sequelize, DataTypes) => {
    
  const Notification = sequelize.define("Notification", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notiMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Notification;
};
