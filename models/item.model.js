'use strict';

module.exports = (sequelize, DataTypes) => {

const Item = sequelize.define('Item', {
  itemTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  itemImage: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://www.mub.eps.manchester.ac.uk/ceasblog/wp-content/themes/uom-theme/assets/images/default-thumbnail.jpg'
  },
  itemCat: {
    type: DataTypes.STRING,
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
    type: DataTypes.DATE, //not sure
    allowNull: false,
  },

  endDate: {
    type: DataTypes.DATE, //not sure
    allowNull: false,
  },

})

return Item;
}
