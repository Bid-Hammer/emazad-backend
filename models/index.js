'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const collection = require('../collection/general-routes')

// const user = require('./user.model');
// const POSTGRES_URL = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL
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
const POSTGRES_URL = 'postgresql://skokash:1094@localhost:5432/emazad';

const sequelizeOption = {}

let sequelize = new Sequelize(POSTGRES_URL, sequelizeOption);

// sequelize.authenticate().then(() => {
//     console.log('Database Connected to postgres')
// }).catch((error) => {
//     console.log(error)
// });



const db = {};
db.sequelize = sequelize;
db.User = require('./user.model')(sequelize, DataTypes);
db.Item = require('./item.model')(sequelize, DataTypes);
db.Bid = require('./bid.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.Favorite = require('./favorite.model')(sequelize, DataTypes);
db.Notification = require('./notification.model')(sequelize, DataTypes);
db.Rating = require('./rating.model')(sequelize, DataTypes);
db.Report = require('./report.model')(sequelize, DataTypes);




// const itemCollection = new collection(itemModel)

module.exports = db;

