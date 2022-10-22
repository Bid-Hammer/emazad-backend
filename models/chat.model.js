"use strict";

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

  });
  
  return Chat;
};
