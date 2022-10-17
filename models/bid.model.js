"use strict";

module.exports = (sequelize, DataTypes) => {
  
  const Bid = sequelize.define("Bid", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    itemID: {
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

// userid, itemid, bidprice
