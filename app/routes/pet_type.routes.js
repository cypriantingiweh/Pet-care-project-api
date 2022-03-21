var  dbConn = require('../../server');
const authJwt = require('../middleware/authJwt.js');

var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var dateTime = date_ob.getFullYear() + "-" + month + "-" + day + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();

 
module.exports = (app) => {
    // add a new pet type  
    app.post('/api/pet_type/register',[authJwt.verifyToken,authJwt.isSUPER],function (req, res) {

        let  name = req.body.name;	
        let created_at = dateTime;
        let updated_at = dateTime;

        // validation
        if (!name)
            return res.status(400).send({ error:true, message: 'Please provide a valid name'});
    

        dbConn.query("INSERT INTO pet_type(type_name,created_at,updated_at) VALUES (?,?,?)", 
        [type_name,created_at,updated_at], 
        function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'Cage successfully added' });
        });
    });

    app.put('/api/pet_type/update/:id', [authJwt.isSUPER, isPETOWNER], function (req, res) {
  
        let id = req.body.id;
        let name = req.body.name;	
        let updated_at = dateTime;
    
        dbConn.query("UPDATE pet_type SET name=?,updated_at=? WHERE id = ?", 
        [name,updated_at,id], function (error, results, fields) {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0)
                message = "pet type not found or data are same";
            else
                message = "pet type successfully updated";

            return res.send({ error: false, data: results, message: message });
        });
    });


    // delete cage by id
    app.delete('/api/pet_type/:id',[authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
  
    let id = req.body.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide pet type id' });
    }
        dbConn.query('DELETE FROM pet_type WHERE id = ?', [id], function (error, results, fields) {
            if (error) throw error;

            // check data updated or not
            let message = "";
            if (results.affectedRows === 0)
                message = "pet type not found";
            else
                message = "pet type successfully deleted";

            return res.send({ error: false, data: results, message: message });
        });
    });

    //get all cage of particular type
    app.get('/api/pet_type',[authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
    
        dbConn.query('SELECT * FROM  pet_type', function (error, results, fields) {
            if (error) throw error;

            // check has data or not
            let message = "";
            if (results === undefined || results.length == 0)
                message = "pet type not found";
            else
                message = "Successfully retrived pet type data";
            return res.send({ error: false, data: results, message: message });
        });
    });
}