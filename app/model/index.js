// const dbConfig = require("../config/db.config.js");

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   dbConfig.DB, 
//   dbConfig.USER, 
//   dbConfig.PASSWORD,
//    {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,

//   define: {
//     underscored: true,
//     freezeTableName: true,
//     charset: 'utf8',
//     dialectOptions: {
//       collate: 'utf8_general_ci'
//     },
//     timestamps: false
//   },

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
// });

// const db = {};
// module.exports = db;