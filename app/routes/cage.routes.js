var  dbConn = require('../../server');
const authJwt = require('../middleware/authJwt.js');

var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var dateTime = date_ob.getFullYear() + "-" + month + "-" + day + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();


module.exports = (app) => {
    // add a new cage  
    app.post('/api/cage/register', [authJwt.verifyToken,authJwt.isSUPER],function (req, res) {

        let  name = req.body.name;	
        let address= req.body.address;
        let height = req.body.height;
        let created_at = dateTime;
        let updated_at = dateTime;
        let pet_type_id = req.body.pet_type_id;
        let capacity = req.body.height * req.body.length * req.body.width;
        let length = req.body.length;
        let width = req.body.width;
        let available = true;

        // validation
        if (!name)
            return res.status(400).send({ error:true, message: 'Please provide a valid name'});
        if(!width)
            return res.status(400).send({ error:true, message: 'Please provide wieght'});
        if (!capacity)
            return res.status(400).send({ error:true, message: 'Please make sure you provide Hieght, width and length'});
        if(!pet_type_id)
                return res.status(400).send({ error:true, message: 'Please provide pet type'});
    

        dbConn.query("INSERT INTO cage(name,address,height,width,length,capacity,created_at,updated_at,available,pet_type_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", 
        [name,address,height,width,length,capacity,created_at,updated_at,available,pet_type_id], 
        function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results.rows[0], message: 'Cage successfully added' });
        });
    });


    app.put('/api/cage/update/:id', [authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
  
        let id = req.body.id;
         let  name = req.body.name;	
        let address= req.body.address;
        let height = req.body.height;
        let updated_at = dateTime;
        let pet_type_id = req.body.pet_type_id;
        let capacity = req.body.height * req.body.length * req.body.width;
        let length = req.body.length;
        let width = req.body.width;
        let available = true;
    

        dbConn.query("UPDATE Pet SET name=$1,address=$2,height=$3,width=$4,length=$5,wieght=$6,date_of_birth=$7,updated_at=$8,pet_type_id=$5,note=$9 WHERE id = $10", 
         [name,address,height,width,length,capacity,updated_at,available,pet_type_id,id], function (error, results, fields) {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0)
                message = "cage not found or data are same";
            else
                message = "cage successfully updated";

            return res.send({ error: false, data: results.rows[0], message: message });
        });
    });

   // delete cage by id
    app.delete('/api/cage/:id',[authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
  
    let id = req.body.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide cage id' });
    }
        dbConn.query('DELETE FROM cage WHERE id = $1', [id], function (error, results, fields) {
            if (error) throw error;

            // check data updated or not
            let message = "";
            if (results.rows === 0)
                message = "cage not found";
            else
                message = "cage successfully deleted";

            return res.send({ error: false, data: results.rows, message: message });
        });
    });

    //get all cage of particular type
    app.get('/api/cage/:pet_type_id',[authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
    
        let pet_type_id = req.params.pet_type_id;
    
        if (!pet_type_id) {
            return res.status(400).send({ error: true, message: 'Please provide pet_type_id' });
        }
    
        dbConn.query('SELECT * FROM cage where pet_type_id=$1', [pet_type_id], function (error, results, fields) {
            if (error) throw error;
            var total_available_spaces = 0;
            // check has data or not
            let message = "";
            if (results.rows === undefined || results.rows.length == 0)
                message = "cage not found";
            else
                message = "Successfully retrived cage data";
            results.rows.forEach(element => {
                total_available_spaces += element.available=0 ? 0 : element.available;
            });
            return res.send({ error: false, data: results.rows, message: message, total_available_spaces:total_available_spaces});
        });
    });

      //get all cage of particular type
    app.get('/api/statistics/:pet_type_id', function (req, res) {
 
        let pet_type_id = req.params.pet_type_id;
    
        if (!pet_type_id) {
            return res.status(400).send({ error: true, message: 'Please provide pet_type_id' });
        }
    
        dbConn.query('SELECT * FROM cage where pet_type_id= $1', [pet_type_id], function (error, results, fields) {
            if (error) throw error;
            var total_available_spaces = 0;
            // check has data or not
            let message = "";
            if (results === undefined || results.length == 0)
                message = "cage not found";
            else
                message = "Successfully retrived cage data";
            results.rows.forEach(element => {
                total_available_spaces += element.available=0 ? 0 : element.available;
            });
            var data = {
                total_spaces:results.rows.length,
                total_spaces_available:total_available_spaces,
                ocupy_spaces:results.rows.length - total_available_spaces,
                
            }
            return res.send({ error: false, data: data, message: "Hello"});
        });
    });

      //get all cage of particular type
    app.get('/api/cage/cage_in-pet/:pet_type_id', function (req, res) {
 
        let pet_type_id = req.params.pet_type_id;
    
        if (!pet_type_id) {
            return res.status(400).send({ error: true, message: 'Please provide pet_type_id' });
        }
    
        dbConn.query('SELECT * FROM cage where pet_type_id=$1 && available = true', [pet_type_id], function (error, results, fields) {
            if (error) throw error;
            var total_available_spaces = 0;
            // check has data or not
            let message = "";
            if (results.rows === undefined || results.rows.length == 0)
                message = "cage not found";
            else
                message = "Successfully retrived cage data";
        
            return res.send({ error: false, data: results.rows, message: message});
        });
    });
}
