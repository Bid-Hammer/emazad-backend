"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
    },
    commentId: {
      type: DataTypes.INTEGER,
    },
    replyId: {
      type: DataTypes.INTEGER,
    },
    bidId: {
      type: DataTypes.INTEGER,
    },
    ratingId: {
      type: DataTypes.INTEGER,
    },
    reportId: {
      type: DataTypes.INTEGER,
    },
    notiMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("unread", "read"),
      allowNull: false,
      defaultValue: "unread",
    },
  });
  return Notification;
};
