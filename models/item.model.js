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
      defaultValue: ["https://res.cloudinary.com/skokash/image/upload/v1671490517/No_Image_Available2_cazymj.jpg"]
      ,
    },
    category: {
      type: DataTypes.ENUM("electronics", "clothes", "realestate", "pets", "vehicles", "others"),
      allowNull: false,
    },

    subCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    itemCondition: {
      type: DataTypes.ENUM("New", "Used"),
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    initialPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    latestBid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
      type: DataTypes.ENUM("standby", "active", "sold", "expired", "deleted"),
      allowNull: false,
      defaultValue: "standby",
    },
  });

  return Item;
};
