"use strict";

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    itemTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemImage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [
        "https://www.mub.eps.manchester.ac.uk/ceasblog/wp-content/themes/uom-theme/assets/images/default-thumbnail.jpg",
      ],
    },
    itemCat: {
      type: DataTypes.ENUM("Electronics", "Clothes", "Real Estate", "Pets", "Vehicles", "Others"),
      allowNull: false,
    },

    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    latestBid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    initialPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    startDate: {
      type: DataTypes.DATE, 
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("standBy", "active", "sold", "expired", "deleted"),
      allowNull: false,
      defaultValue: "standBy",
    },
  });

  return Item;
};
