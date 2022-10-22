"use strict";

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("Report", {
    reportTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reportMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reportReason: {
      type: DataTypes.ENUM("Spam", "Inappropriate", "Scam", "Other"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Report;
};
