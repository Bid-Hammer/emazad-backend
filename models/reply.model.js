"use strict";

module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define("Reply", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    reply: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Reply;
}