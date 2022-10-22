"use strict";

module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define("Bid", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bidprice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Bid;
};
