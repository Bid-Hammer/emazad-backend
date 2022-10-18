"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const collection = require("../collection/general-routes");

// const user = require('./user.model');
// const POSTGRES_URL = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;
// const sequelizeOption = {
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false
//         }
//     }
// }

// for local testing

// const POSTGRES_URL = 'postgres://odat:0000@localhost:5432/postgres';

const POSTGRES_URL = "postgresql://skokash:1094@localhost:5432/emazad";


const sequelizeOption = {};

let sequelize = new Sequelize(POSTGRES_URL, sequelizeOption);

// sequelize.authenticate().then(() => {
//     console.log('Database Connected to postgres')
// }).catch((error) => {
//     console.log(error)
// });

const db = {};
db.sequelize = sequelize;
db.userModel = require("./user.model")(sequelize, DataTypes);
db.itemModel = require("./item.model")(sequelize, DataTypes);
db.bidModel = require("./bid.model")(sequelize, DataTypes);
db.commentModel = require("./comment.model")(sequelize, DataTypes);
db.favoriteModel = require("./favorite.model")(sequelize, DataTypes);
db.notificationModel = require("./notification.model")(sequelize, DataTypes);
db.ratingModel = require("./rating.model")(sequelize, DataTypes);
db.reportModel = require("./report.model")(sequelize, DataTypes);

// User Associations
db.userModel.hasMany(db.itemModel, { foreignKey: "userID", sourceKey: "id" });
db.itemModel.belongsTo(db.userModel, { foreignKey: "userID", targetKey: "id" });

db.userModel.hasMany(db.bidModel, { foreignKey: "userID", sourceKey: "id" });
db.bidModel.belongsTo(db.userModel, { foreignKey: "userID", targetKey: "id" });

db.userModel.hasMany(db.commentModel, {
    foreignKey: "userID",
    sourceKey: "id",
});
db.commentModel.belongsTo(db.userModel, {
    foreignKey: "userID",
    targetKey: "id",
});

db.userModel.hasMany(db.favoriteModel, {
    foreignKey: "userID",
    sourceKey: "id",
});
db.favoriteModel.belongsTo(db.userModel, {
    foreignKey: "userID",
    targetKey: "id",
});

db.userModel.hasMany(db.notificationModel, {
    foreignKey: "userID",
    sourceKey: "id",
});
db.notificationModel.belongsTo(db.userModel, {
    foreignKey: "userID",
    targetKey: "id",
});

db.userModel.hasMany(db.ratingModel, { foreignKey: "userID", sourceKey: "id" });
db.ratingModel.belongsTo(db.userModel, {
    foreignKey: "userID",
    targetKey: "id",
});

db.userModel.hasMany(db.reportModel, { foreignKey: "userID", sourceKey: "id" });
db.reportModel.belongsTo(db.userModel, {
    foreignKey: "userID",
    targetKey: "id",
});

// Item Associations
db.itemModel.hasMany(db.bidModel, { foreignKey: "itemID", sourceKey: "id" });
db.bidModel.belongsTo(db.itemModel, { foreignKey: "itemID", targetKey: "id" });

db.itemModel.hasMany(db.commentModel, {
    foreignKey: "itemID",
    sourceKey: "id",
});
db.commentModel.belongsTo(db.itemModel, {
    foreignKey: "itemID",
    targetKey: "id",
});

db.itemModel.hasMany(db.favoriteModel, {
    foreignKey: "itemID",
    sourceKey: "id",
});
db.favoriteModel.belongsTo(db.itemModel, {
    foreignKey: "itemID",
    targetKey: "id",
});

db.itemModel.hasMany(db.notificationModel, {
    foreignKey: "itemID",
    sourceKey: "id",
});
db.notificationModel.belongsTo(db.itemModel, {
    foreignKey: "itemID",
    targetKey: "id",
});

db.itemModel.hasMany(db.reportModel, { foreignKey: "itemID", sourceKey: "id" });
db.reportModel.belongsTo(db.itemModel, {
    foreignKey: "itemID",
    targetKey: "id",
});

// Notification Associations
db.bidModel.hasMany(db.notificationModel, {
    foreignKey: "bidID",
    sourceKey: "id",
});
db.notificationModel.belongsTo(db.bidModel, {
    foreignKey: "bidID",
    targetKey: "id",
});

db.commentModel.hasMany(db.notificationModel, {
    foreignKey: "commentID",
    sourceKey: "id",
});
db.notificationModel.belongsTo(db.commentModel, {
    foreignKey: "commentID",
    targetKey: "id",
});

db.favoriteModel.hasMany(db.notificationModel, {
    foreignKey: "favoriteID",
    sourceKey: "id",
});
db.notificationModel.belongsTo(db.favoriteModel, {
    foreignKey: "favoriteID",
    targetKey: "id",
});

db.ratingModel.hasMany(db.notificationModel, {
    foreignKey: "ratingID",
    sourceKey: "id",
});
db.notificationModel.belongsTo(db.ratingModel, {
    foreignKey: "ratingID",
    targetKey: "id",
});

db.reportModel.hasMany(db.notificationModel, {
    foreignKey: "reportID",
    sourceKey: "id",
});
db.notificationModel.belongsTo(db.reportModel, {
    foreignKey: "reportID",
    targetKey: "id",
});

db.Item = new collection(db.itemModel);
db.Bid = new collection(db.bidModel);
db.Comment = new collection(db.commentModel);
db.Favorite = new collection(db.favoriteModel);
db.Notification = new collection(db.notificationModel);
db.Rating = new collection(db.ratingModel);
db.Report = new collection(db.reportModel);

module.exports = db;
