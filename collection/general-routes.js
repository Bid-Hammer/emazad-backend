"use strict";
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

  // function for getting -> all items || items by category || item by subcategory ---> based on the status
  async readItems(status, category, subCategory, users, bids) {
    try {
      const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];
      const includeUsers = { include: [{ model: users, attributes: { exclude: excludedAttributes } }] };
      const includeAll = [
        { model: users, attributes: { exclude: excludedAttributes } },
        { model: bids, includeUsers },
      ];

      const sortedItems = (items) => {
        if (status === "standby") {
          return items.sort((a, b) => b.startDate - a.startDate);
        }
        return items.sort((a, b) => b.endDate - a.endDate);
      };

      let handelWhere = {};
      if (status && !category && !subCategory) {
        status === "all" ? null : (handelWhere = { status: status });
      }
      if (status && category && !subCategory) {
        status === "all"
          ? (handelWhere = { category: category })
          : (handelWhere = { status: status, category: category });
      }
      if (status && category && subCategory) {
        status === "all"
          ? (handelWhere = { category: category, subCategory: subCategory })
          : (handelWhere = { status: status, category: category, subCategory: subCategory });
      }

      const items = await this.model.findAll({
        where: handelWhere,
        include: includeAll,
      });
      return sortedItems(items);
    } catch (err) {
      console.log("Error in GeneralRoutes.readItems: ", err.message);
    }
  }

  async readOneItem(id, users, bids, comments, Replies) {
    try {
      const excludedAttributes = ["password", "email", "role", "createdAt", "updatedAt", "token"];
      const includeAll = [
        { model: users, attributes: { exclude: excludedAttributes } },
        {
          model: comments,
          include: [
            { model: users, attributes: { exclude: excludedAttributes } },
            { model: Replies, include: [{ model: users, attributes: { exclude: excludedAttributes } }] },
          ],
        },
        { model: bids, include: [{ model: users, attributes: { exclude: excludedAttributes } }] },
      ];

      const item = await this.model.findOne({
        where: { id: id },
        include: includeAll,
      });
      return item;
    } catch (err) {
      console.log("Error in GeneralRoutes.readOneItem: ", err.message);
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

  // function for getting -> all notificaitons || one notification ----->> not needed till now
  async readNotification(id) {
    try {
      if (id) {
        return await this.model.findOne({
          where: { id: id, status: ["unread", "read"] },
        });
      } else {
        return await this.model.findAll({
          where: { status: ["unread", "read"] },
        });
      }
    } catch (err) {
      console.log("Error in GeneralRoutes.readNotification: ", err.message);
    }
  }

  // function for getting all notifications for a specific user
  async readUserNotifications(id) {
    try {
      const notifications = await this.model.findAll({
        where: { userId: id, status: ["unread", "read"] },
      });
      return notifications.sort((a, b) => b.createdAt - a.createdAt);
    } catch (err) {
      console.log("Error in GeneralRoutes.readUserNotifications: ", err.message);
    }
  }

  // update notification status to read
  async updateNotification(id) {
    try {
      const notification = await this.model.findOne({ where: { id: id } });
      return await notification.update({ status: "read" });
    } catch (err) {
      console.log("Error in GeneralRoutes.updateNotification: ", err.message);
    }
  }

  // function for creating a rating for a specific user by a specific user
  async createRating(obj, userModel) {
    try {
      const user = await userModel.findOne({ where: { id: obj.userId } });
      const ratedUser = await userModel.findOne({ where: { id: obj.ratedId } });
      const rating = await this.model.findOne({
        where: { userId: obj.userId, ratedId: obj.ratedId },
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
      const userRatings = await this.model.findAll({ where: { ratedId: id } });
      const ratingAverage = userRatings.reduce((acc, curr) => acc + curr.rating, 0) / userRatings.length;
      const ratingCount = userRatings.length;

      return { ratingAverage, ratingCount };
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
      return await this.model.findAll({ where: { userId: id }, include: [items] });
    } catch (err) {
      console.log("Error in GeneralRoutes.getFavorites: ", err.message);
    }
  }
}

module.exports = GeneralRoutes;
