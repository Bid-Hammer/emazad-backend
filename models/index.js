"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const collection = require("../collection/general-routes");
require("dotenv").config();

const POSTGRES_URL = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;
const sequelizeOption = {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

// const sequelizeOption = {};
let sequelize = new Sequelize(POSTGRES_URL, sequelizeOption);

// checking if the connection is established or not to the database (extra)
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database Connected to postgres");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// Models
const db = {};
db.sequelize = sequelize;
db.userModel = require("./user.model")(sequelize, DataTypes);
db.itemModel = require("./item.model")(sequelize, DataTypes);
db.bidModel = require("./bid.model")(sequelize, DataTypes);
db.commentModel = require("./comment.model")(sequelize, DataTypes);
db.replyModel = require("./reply.model")(sequelize, DataTypes);
db.favoriteModel = require("./favorite.model")(sequelize, DataTypes);
db.notificationModel = require("./notification.model")(sequelize, DataTypes);
db.ratingModel = require("./rating.model")(sequelize, DataTypes);
db.reportModel = require("./report.model")(sequelize, DataTypes);
db.chatModel = require("./chat.model")(sequelize, DataTypes);


// Collections
db.Item = new collection(db.itemModel);
db.Bid = new collection(db.bidModel);
db.Comment = new collection(db.commentModel);
db.Reply = new collection(db.replyModel);
db.Favorite = new collection(db.favoriteModel);
db.Notification = new collection(db.notificationModel);
db.Rating = new collection(db.ratingModel);
db.Report = new collection(db.reportModel);
db.Chat = new collection(db.chatModel);


// Relations

// User relations
db.userModel.hasMany(db.itemModel, { foreignKey: "userId", sourceKey: "id" });
db.itemModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

db.userModel.hasMany(db.bidModel, { foreignKey: "userId", sourceKey: "id" });
db.bidModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

db.userModel.hasMany(db.commentModel, { foreignKey: "userId", sourceKey: "id" });
db.commentModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

db.userModel.hasMany(db.replyModel, { foreignKey: "userId", sourceKey: "id" });
db.replyModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

db.userModel.hasMany(db.favoriteModel, { foreignKey: "userId", sourceKey: "id" });
db.favoriteModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

db.userModel.hasMany(db.notificationModel, { foreignKey: "userId", sourceKey: "id" });
db.notificationModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

db.userModel.hasMany(db.ratingModel, { foreignKey: "userId", sourceKey: "id" });
db.ratingModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

db.userModel.hasMany(db.ratingModel, { foreignKey: "ratedId", sourceKey: "id" });
db.ratingModel.belongsTo(db.userModel, { foreignKey: "ratedId", targetKey: "id" });

db.userModel.hasMany(db.reportModel, { foreignKey: "userId", sourceKey: "id" });
db.reportModel.belongsTo(db.userModel, { foreignKey: "userId", targetKey: "id" });

// Item relations
db.itemModel.hasMany(db.bidModel, { foreignKey: "itemId", sourceKey: "id" });
db.bidModel.belongsTo(db.itemModel, { foreignKey: "itemId", targetKey: "id" });

db.itemModel.hasMany(db.commentModel, { foreignKey: "itemId", sourceKey: "id" });
db.commentModel.belongsTo(db.itemModel, { foreignKey: "itemId", targetKey: "id" });

db.itemModel.hasMany(db.favoriteModel, { foreignKey: "itemId", sourceKey: "id" });
db.favoriteModel.belongsTo(db.itemModel, { foreignKey: "itemId", targetKey: "id" });

db.itemModel.hasMany(db.notificationModel, { foreignKey: "itemId", sourceKey: "id" });
db.notificationModel.belongsTo(db.itemModel, { foreignKey: "itemId", targetKey: "id" });

db.itemModel.hasMany(db.reportModel, { foreignKey: "itemId", sourceKey: "id" });
db.reportModel.belongsTo(db.itemModel, { foreignKey: "itemId", targetKey: "id" });

// Bid relations
db.bidModel.hasMany(db.notificationModel, { foreignKey: "bidId", sourceKey: "id" });
db.notificationModel.belongsTo(db.bidModel, { foreignKey: "bidId", targetKey: "id" });

// Comment relations
db.commentModel.hasMany(db.replyModel, { foreignKey: "commentId", sourceKey: "id" });
db.replyModel.belongsTo(db.commentModel, { foreignKey: "commentId", targetKey: "id" });

db.commentModel.hasMany(db.notificationModel, { foreignKey: "commentId", sourceKey: "id" });
db.notificationModel.belongsTo(db.commentModel, { foreignKey: "commentId", targetKey: "id" });

// Reply relations
db.replyModel.hasMany(db.notificationModel, { foreignKey: "replyId", sourceKey: "id" });
db.notificationModel.belongsTo(db.replyModel, { foreignKey: "replyId", targetKey: "id" });

// Rating relations
db.ratingModel.hasMany(db.notificationModel, { foreignKey: "ratingId", sourceKey: "id" });
db.notificationModel.belongsTo(db.ratingModel, { foreignKey: "ratingId", targetKey: "id" });

// Chat relations

db.userModel.hasMany(db.chatModel, { foreignKey: "senderId", sourceKey: "id" });
db.chatModel.belongsTo(db.userModel, { foreignKey: "senderId", targetKey: "id" });

db.userModel.hasMany(db.chatModel, { foreignKey: "receiverId", sourceKey: "id" });
db.chatModel.belongsTo(db.userModel, { foreignKey: "receiverId", targetKey: "id" });



module.exports = db;
