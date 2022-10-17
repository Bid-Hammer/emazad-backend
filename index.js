"use strict";
require("dotenv").config();
const server = require("./server");
const db = require("./models/index").sequelize;

db.sync()
  .then(() => {
    server.start(process.env.PORT || 4001);
  })
  .catch(console.error);

// force to drob table and create new one

// db.sync({ force: true })
//   .then(() => {
//     server.start(process.env.PORT || 4000);
//   })
//   .catch(console.error);
