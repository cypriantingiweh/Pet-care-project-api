var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

const  cors = require("cors");

var corsOptions = {
 origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// set port
app.listen(4000, function () {
    console.log('Node app is running on port 4000');
});
module.exports = app;
const dbConfig = require("./app/config/db.config.js");

// db.sequelize.sync();

// connection configurations
var dbConn = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,

  define: {
    underscored: true,
    freezeTableName: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: false
  },
});

module.exports  = dbConn;

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pet management  application." });
});

//pet routes

require('./app/routes/users.routes')(app);

require('./app/routes/pet.routes')(app);

require('./app/routes/cage.routes')(app);

require('./app/routes/pet_type.routes')(app);
require('./app/routes/services.routes')(app);

