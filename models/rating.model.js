"use strict";

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("Rating", {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratedID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Rating;
};
