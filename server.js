var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var postgres = require('pg');
const { Pool } = require("pg");

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

async function poolDemo() {
  const pool = new Pool(dbConfig);
  const now = await pool.query("SELECT NOW()");
  await pool.end();

  return now;
}

var dbConn = new postgres.Pool(dbConfig);

(async () => {
  const poolResult = await poolDemo();
  console.log("Time with pool: " + poolResult.rows[0]["now"]);
})();

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

