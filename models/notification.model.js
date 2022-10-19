"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemID: {
      type: DataTypes.INTEGER,
    },
    commentID: {
      type: DataTypes.INTEGER,
    },
    bidID: {
      type: DataTypes.INTEGER,
    },
    ratingID: {
      type: DataTypes.INTEGER,
    },
    reportID: {
      type: DataTypes.INTEGER,
    },
    notiMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("unread", "read", "deleted"),
      allowNull: false,
      defaultValue: "unread",
    },
  });
  return Notification;
};
