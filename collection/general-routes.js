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

  // async itemWithNotification(notification) {
  //   try {
  //     return await this.model.findAll({
  //       include: notification,
  //     });
  //   } catch (err) {
  //     console.log("Error in GeneralRoutes.itemWithNotification: ", err.message);
  //   }
  // }
}

module.exports = GeneralRoutes;
