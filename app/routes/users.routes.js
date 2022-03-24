var  dbConn = require('../../server');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verifySignUp = require('../middleware/verifySignUp.js');
const authJwt = require('../middleware/authJwt.js');

const config = require('../config/auth.config.js');

var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var dateTime = date_ob.getFullYear() + "-" + month + "-" + day + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();




module.exports = (app) => {
// add a new book  
app.post('/api/user/register', [verifySignUp.checkDuplicateUserNameOrEmail], function (req, res) {

    console.log(req.body);

    let email = req.body.email;
    let fullnames = req.body.fullnames;
    let phone = req.body.phone;
    let password = bcrypt.hashSync(req.body.password,8);
    let role = "PET_OWNER";
     let created_at = dateTime;
    let updated_at = dateTime;

    // validation
    if (!email)
        return res.status(400).send({ error:true, message: 'Please provide a valid Email'});
    if(!fullnames)
        return res.status(400).send({ error:true, message: 'Please provide a first and last names'});
    if (!phone)
        return res.status(400).send({ error:true, message: 'Please provide a phone number'});

    // insert to db

    dbConn.query("INSERT INTO Users(fullnames,phone,email,role,created_at,updated_at,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", 
    [fullnames,phone,email,role,created_at,updated_at,password], 
    function (error, results, fields) {
        if (error) throw error;
        let users_id = results.insertId;
        return res.send({ error: false, data: results.rows[0], message: 'User successfully added' });
    });
});

app.post('/api/user/login', function (req, res) {
    console.log(req.body.email);

    dbConn.query("SELECT * FROM Users where email=$1",[req.body.email], function (error, results, fields) {
        if (error) throw error;
        // check has data or not
        let message = "";
        if (results === undefined || results.rows.length == 0){
            message = "User not found";
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, results.rows[0].password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
        }
        
        var token = jwt.sign({userId:results.rows[0].id, email:results.rows[0].email, fullnames:results.rows[0].fullnames,role:results.rows[0].role,}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
       return res.status(200).send({ auth: true, accessToken: token, user:results.rows[0]});
    });
});


app.get('/api/user', [authJwt.verifyToken, authJwt.isSUPER], function (req, res) {
    dbConn.query("SELECT Users.id,fullnames,phone,email,role,Pet.name as pet_name, Pet.wieght as pet_weight,Pet.date_of_birth as petdatOfBirth,pet_type.type_name as pettype FROM Users, pet_owner, Pet,cage_in_pet, pet_type WHERE Users.id = pet_owner.Users_id AND pet_owner.Pet_id = Pet.id AND Pet.pet_type_id = pet_type.id",function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results.rows === undefined || results.rows.length == 0)
            message = "users table is empty";
        else
            message = "Successfully retrived all users";
        return res.send(results.rows);
    });
});

app.get('/api/user', [authJwt.verifyToken, authJwt.isSUPER], function (req, res) {
    dbConn.query('SELECT DISTINCT * from Users,pet_owner where  Users.id = pet_owner.Users_id', [req.params.Pet_id], function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results.rows === undefined || results.rows.length == 0){
            message = "users table is empty";
        }

        const ids = arr.map(o => o.fullnames)
        const filtered = arr.filter(({fullnames}, index) => !ids.includes(fullnames, index + 1))
        message = "Successfully retrived all users";
        return res.send(filtered);
    });
});

}
