'use strict';



module.exports = (sequelize, DataTypes) => {
    const Report =  sequelize.define('Report', {
        reportTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reportMessage: {
            type: DataTypes.STRING,    
            allowNull: false
        },
        reportReason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Report;
  }