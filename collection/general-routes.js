"use strict";
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

  async itemWithAllInfo(comments, bids, users, favorite, rating) {
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
        where: { status: "standBy" || "active" },
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
}

module.exports = GeneralRoutes;
