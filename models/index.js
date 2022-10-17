'use strict';
const { Sequelize, DataTypes } = require('sequelize');
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
const POSTGRES_URL = 'postgres://localhost:5432/postgres';
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

module.exports = db;

// another way for exporting sequelize 
// const sequelize = new Sequelize(POSTGRES_URL);
// const db = {};
// db.sequelize = sequelize;
// db.userModel = require('./user.model') (sequelize, DataTypes);
// module.exports = db;