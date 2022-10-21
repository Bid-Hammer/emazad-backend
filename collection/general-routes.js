"use strict";
// const { Op } = require("sequelize");

class GeneralRoutes {
  constructor(model) {
    this.model = model;
  }

  // general route for creating anything
  async create(obj) {
    try {
      return await this.model.create(obj);
    } catch (err) {
      console.log("Error in GeneralRoutes.create: ", err.message);
    }
  }

  // general function for reading anything by id or all
  async read(id) {
    try {
      if (id) {
        return await this.model.findOne({ where: { id: id } });
      } else {
        return await this.model.findAll();
      }
    } catch (err) {
      console.log("Error in GeneralRoutes.read: ", err.message);
    }
  }

  // general function for updating anything by id
  async update(id, obj) {
    try {
      const dataById = await this.model.findOne({ where: { id: id } });
      return await dataById.update(obj);
    } catch (err) {
      console.log("Error in GeneralRoutes.update: ", err.message);
    }
  }

  // general function for deleting anything by id
  async delete(id) {
    try {
      return await this.model.destroy({ where: { id: id } });
    } catch (err) {
      console.log("Error in GeneralRoutes.delete: ", err.message);
    }
  }

  // general function for updating anything that has a status to deleted by id
  async hide(id) {
    try {
      return await this.model.update({ status: "deleted" }, { where: { id: id } });
    } catch (err) {
      console.log("Error in GeneralRoutes.delete: ", err.message);
    }
  }

  // function for getting -> all items || items by category || item by subcategory
  async readItems(category, subCategory, comments, bids, users, favorite, Op) {
    try {
      const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];
      const include = [
        {
          model: users,
          attributes: { exclude: excludedAttributes },
        },
        {
          model: comments,
          include: [{ model: users, attributes: { exclude: excludedAttributes } }],
        },
        {
          model: bids,
          include: [{ model: users, attributes: { exclude: excludedAttributes } }],
        },
        {
          model: favorite,
          include: [{ model: users, attributes: { exclude: excludedAttributes } }],
        },
      ];

      if (category === null && subCategory === null) {
        const item = await this.model.findAll({
          where: { [Op.or]: [{ status: "active" }, { status: "standBy" }] },
          include,
        });
        const sortedItems = item.sort((a, b) => {
          return new Date(a.endDate) - new Date(b.endDate);
        });
        return sortedItems;
      }

      if (category !== null && subCategory === null) {
        const item = await this.model.findAll({
          where: { [Op.and]: [{ category: category }, { [Op.or]: [{ status: "active" }, { status: "standBy" }] }] },
          include,
        });
        const sortedItems = item.sort((a, b) => {
          return new Date(a.endDate) - new Date(b.endDate);
        });
        return sortedItems;
      }

      const item = await this.model.findAll({
        where: {
          [Op.and]: [
            { category: category },
            { subCategory: subCategory },
            { [Op.or]: [{ status: "active" }, { status: "standBy" }] },
          ],
        },
        include,
      });
      const sortedItems = item.sort((a, b) => {
        return new Date(a.endDate) - new Date(b.endDate);
      });
      return sortedItems;
    } catch (err) {
      console.log("Error in GeneralRoutes.readItems: ", err.message);
    }
  }

  // function for getting -> all notificaitons || notifications by user id ----->> not needed till now
  async readNotification(id, Op) {
    try {
      if (id) {
        return await this.model.findOne({
          where: { [Op.and]: [{ id: id }, { [Op.or]: [{ status: "unread" }, { status: "read" }] }] },
        });
      } else {
        return await this.model.findAll({
          where: { [Op.or]: [{ status: "unread" }, { status: "read" }] },
        });
      }
    } catch (err) {
      console.log("Error in GeneralRoutes.readNotification: ", err.message);
    }
  }

  // function for getting all notifications for a specific user
  async readUserNotifications(id, Op) {
    try {
      return await this.model.findAll({
        where: { [Op.and]: [{ userID: id }, { [Op.or]: [{ status: "unread" }, { status: "read" }] }] },
      });
    } catch (err) {
      console.log("Error in GeneralRoutes.readUserNotifications: ", err.message);
    }
  }

  // function for creating a rating for a specific user by a specific user
  async createRating(obj, userModel, Op) {
    try {
      const user = await userModel.findOne({ where: { id: obj.userID } });
      const ratedUser = await userModel.findOne({ where: { id: obj.ratedID } });
      const rating = await this.model.findOne({
        where: { [Op.and]: [{ userID: obj.userID }, { ratedID: obj.ratedID }] },
      });

      if (user.id === ratedUser.id) {
        return "You can't rate yourself";
      }
      if (rating) {
        return "You can't rate more than once";
      }
      return await this.model.create(obj);
    } catch (err) {
      console.log("Error in GeneralRoutes.createRating: ", err.message);
    }
  }

  // function for getting the average ratings for a specific user
  async getAverageRating(id) {
    try {
      const dataById = await this.model.findAll({ where: { ratedID: id } });
      const averageRating = dataById.reduce((acc, curr) => {
        return acc + curr.rating;
      }, 0);
      return averageRating / dataById.length;
    } catch (err) {
      console.log("Error in GeneralRoutes.averageRating: ", err.message);
    }
  }

     // function for getting a favorite list for all users
     async favoriteList(users, items) {
      try {
        const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];
  
        return await this.model.findAll({
          include: [
            { model: users, attributes: { exclude: excludedAttributes } },
            { model: items, include: [{ model: users, attributes: { exclude: excludedAttributes } }] },
          ],
        });
      } catch (err) {
        console.log("Error in GeneralRoutes.favoriteList: ", err.message);
      }
    }

  // function for getting all favorites for a specific user
  async userFavorites(id, items) {
    try {
      return await this.model.findAll({ where: { userID: id }, include: [items] });
    } catch (err) {
      console.log("Error in GeneralRoutes.getFavorites: ", err.message);
    }
  }

  // function for creating an item 
  async createItem(obj, fs) {
    try {
      return await this.model.create(obj);
    } catch (err) {
      obj.itemImage.map((file) => fs.unlinkSync(file));
      console.log("Error in GeneralRoutes.createItem: ", err.message);
    }
  }

}

module.exports = GeneralRoutes;
