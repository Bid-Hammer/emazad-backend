"use strict";

module.exports = (sequelize, DataTypes) => {

  const Comment = sequelize.define("Comment", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Comment;
};
