'use strict';
module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    })
    return Favorite;
};