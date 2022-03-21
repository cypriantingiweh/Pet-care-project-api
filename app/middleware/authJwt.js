const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
 
verifyToken = (req, res, next) => {
  
  let token = req.headers['x-access-token'];
  
  if (!token){
    return res.status(403).send({ 
      auth: false, message: 'No token provided.' 
    });
  }
 
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err){
      return res.status(500).send({ 
          auth: false, 
          message: 'Fail to Authentication. Error -> ' + err 
        });
    }
    req.userId = decoded.id; 
    req.email =decoded.email; 
    req.fullnames =decoded.fullnames,
    req.role = decoded.role
    next();
  });
}
 
isPETOWNER= (req, res, next) => {

  if(req.role.toUpperCase() === "PET_OWNER"){
    next();
    return;
  }
  res.status(403).send("Require Admin Role!");
  return
}

isSUPER = (req, res, next) => {
    if(req.role.toUpperCase() === "SUPER"){
      req.role = "PET_OWNER";
      next();
      return;
    }
  res.status(403).send("Require SUPER Admin Role!");
  return
}
 
const authJwt = {};
authJwt.verifyToken = verifyToken;

authJwt.isPETOWNER = isPETOWNER;
authJwt.isSUPER = isSUPER;

module.exports = authJwt;