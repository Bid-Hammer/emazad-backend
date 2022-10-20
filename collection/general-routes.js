"use strict";
const { Op } = require("sequelize");

class GeneralRoutes {
  constructor(model) {
    this.model = model;
  }

  async create(obj) {
    try {
      return await this.model.create(obj);
    } catch (err) {
      console.log("Error in GeneralRoutes.create: ", err.message);
    }
  }

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

  async update(id, obj) {
    try {
      const dataById = await this.model.findOne({ where: { id: id } });
      return await dataById.update(obj);
    } catch (err) {
      console.log("Error in GeneralRoutes.update: ", err.message);
    }
  }

  async delete(id) {
    try {
      return await this.model.destroy({ where: { id: id } });
    } catch (err) {
      console.log("Error in GeneralRoutes.delete: ", err.message);
    }
  }

  async hide(id) {
    try {
      return await this.model.update(
        { status: "deleted" },
        { where: { id: id } }
      );
    } catch (err) {
      console.log("Error in GeneralRoutes.delete: ", err.message);
    }
  }


  async itemWithAllInfo(comments, bids, users, favorite, rating, Op) {
    try {
      const excludedAttributes = [
        "password",
        "email",
        "role",
        "createdAt",
        "updatedAt",
        "token",
      ];
      return await this.model.findAll({
        where: {
          [Op.or]: [{ status: "active" }, { status: "standBy" }]
        },
        include: [
          {
            model: users,
            attributes: {
              exclude: excludedAttributes,
            },
            include: [rating],
          },
          {
            model: comments,
            include: [
              {
                model: users,
                attributes: {
                  exclude: excludedAttributes,
                },
              },
            ],
          },
          {
            model: bids,
            include: [
              {
                model: users,
                attributes: {
                  exclude: excludedAttributes,
                },
              },
            ],
          },
          {
            model: favorite,
            include: [
              {
                model: users,
                attributes: {
                  exclude: excludedAttributes,
                },
              },
            ],
          },
        ],
      });
    } catch (err) {
      console.log("Error in GeneralRoutes.itemWithAll: ", err.message);
    }
  }

  async favoriteList(users, items) {
    try {
      const excludedAttributes = [
        "password",
        "email",
        "role",
        "createdAt",
        "updatedAt",
        "token",
      ];

      return await this.model.findAll({
        include: [
          {
            model: users,
            attributes: {
              exclude: excludedAttributes,
            },
          },
          {
            model: items,
            include: [
              {
                model: users,
                attributes: {
                  exclude: excludedAttributes,
                },
              },
            ],
          },
        ],
      });
    } catch (err) {
      console.log("Error in GeneralRoutes.favoriteList: ", err.message);
    }
  }


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
      console.log("Error in GeneralRoutes.read: ", err.message);
    }
  }

  async readUserNotifications(id, Op) {
    try {
      return await this.model.findAll({
        where: { [Op.and]: [{ userID: id }, { [Op.or]: [{ status: "unread" }, { status: "read" }] }] },
      });
    } catch (err) {
      console.log("Error in GeneralRoutes.read: ", err.message);
    }
  }

  // create a function to find all ratings for a specific user and return the average rating
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


  // create a function to find all favorites for a specific user 
  async userFavorites(id, items) {
    try {
      return await this.model.findAll({ where: { userID: id }, include: [items] });
    } catch (err) {
      console.log("Error in GeneralRoutes.getFavorites: ", err.message);
    }
  }



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
