var  dbConn = require('../../server');
const config = require('../config/auth.config.js');
const ROLEs = config.ROLEs;
 
checkDuplicateUserNameOrEmail = (req, res, next) => {
  // -> Check email is already in use
 
     dbConn.query('SELECT * FROM Users where email=? && fullnames=?', [req.body.email ,req.body.fullnames], function (error, results, fields) {
        if (error) throw error;
        
        if (results === !undefined || results.length != 0){
            res.status(400).send({message:"Pet Owner details already Exist.Go ahead to add Pet(s)",data:{
              email: results[0].email,
              fullnames:results[0].fullnames,
              id: results[0].id,
              phone: results[0].phone,
              role: results[0].role
            }});
            return ;
        }
        next();
    });   
  }

 checkDuplicatePetNameOrDateOFBirth = (req, res, next) => {
  // -> Check email is already in use
 
    dbConn.query('SELECT * FROM Pet where name=?', req.body.name, function (error, results, fields) {
        if (error) throw error;
        
        if (results === !undefined || results.length != 0){
            res.status(400).send("Fail -> Pet Name already exist!");
            return;
        }
        next();
    });
    
    dbConn.query('SELECT * FROM Pet where date_of_birth=?', req.body.date_of_birth, function (error, results, fields) {
        if (error) throw error;
        
        if (results === !undefined || results.length != 0){
            res.status(400).send("Fail ->  Pet Name already exist!");
            return;
        }
        next();
    });
  }
checkRolesExisted = (req, res, next) => {  
  
    if(!ROLEs.includes(req.body.role.toUpperCase())){
      res.status(400).send("Fail -> Does NOT exist Role = " + req.body.role);
      return;
    }
  next();
}
 
const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRolesExisted = checkRolesExisted;
signUpVerify.checkDuplicatePetNameOrDateOFBirth = checkDuplicatePetNameOrDateOFBirth
 
module.exports = signUpVerify;