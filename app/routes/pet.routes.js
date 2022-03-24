var  dbConn = require('../../server');
const authJwt = require('../middleware/authJwt.js');
const verifySignUp = require('../middleware/verifySignUp.js');

var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var dateTime = date_ob.getFullYear() + "-" + month + "-" + day + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();


module.exports = (app) => {
    // add a new pet  
    app.post('/api/pet/register', [authJwt.verifyToken,authJwt.isSUPER],function (req, res) {


        dbConn.query("SELECT * FROM Pet where name=$1", [req.body.name], function (error, results, fields) {
            if (error) throw error;
            
            if (results.rows === !undefined || results.rows.length != 0){
              return res.status(400).send({message:"Pet Name already exist! Has this pet ever been here?",data:results[0]});     
            }else{

                let name = req.body.name;	
                let wieght= req.body.wieght;
                let date_of_birth = req.body.date_of_birth;
                let created_at = dateTime;
                let updated_at = dateTime;
                let pet_type_id = req.body.pet_type_id;
                let note = req.body.note;
                let Users_id = req.body.Users_id

                // validation
                if (!name)
                    return res.status(400).send({ error:true, message: 'Please provide a valid name'});
                if(!wieght)
                    return res.status(400).send({ error:true, message: 'Please provide wieght'});
                if (!date_of_birth)
                    return res.status(400).send({ error:true, message: 'Please provide date_of_birth'});
                if(!pet_type_id)
                        return res.status(400).send({ error:true, message: 'Please provide pet type'});
                if (!note)
                    return res.status(400).send({ error:true, message: 'Please provide a  note'});
                // insert to db

                dbConn.query("INSERT INTO Pet(name,wieght,date_of_birth,created_at,updated_at,pet_type_id,note) VALUES ($1,$2,$3,$4,$5,$6,$7)", 
                [name,wieght,date_of_birth,created_at,updated_at,pet_type_id,note], 
                function (error, results, fields) {
                    console.log(results);
                    if (error) {throw error;}
                    dbConn.query("INSERT INTO pet_owner(Users_id,Pet_id,created_at,updated_at) VALUES ($1,$2,$3,$4)",[Users_id,results.insertId,created_at,updated_at]);

                    res.status(200).send({ error: false, data:results.insertId, message: 'Pet successfully added' });
                    return;
                });
            }
        });

    });

    // update pet with id
    app.put('/api/pet/update/:id', [authJwt.verifyToken,authJwt.isSUPER, isPETOWNER], function (req, res) {
  
        let id = req.body.id;
        let name = req.body.name;	
        let wieght= req.body.wieght;
        let date_of_birth = req.body.date_of_birth;
        let updated_at = dateTime;
        let pet_type_id = req.body.pet_type_id;
        let note = req.body.note;
    

        dbConn.query("UPDATE Pet SET name=$1,wieght=$2,date_of_birth=$3,updated_at=$4,pet_type_id=$5,note=$5 WHERE id = $6", 
        [name,wieght,date_of_birth,updated_at,pet_type_id,note,id], function (error, results, fields) {
            if (error) throw error;

            let message = "";
            if (results.rows === 0)
                message = "goods not found or data are same";
            else
                message = "goods successfully updated";

            return res.send({ error: false, data: results.rows, message: message });
        });
    });

    // delete pet by id
    app.delete('/api/pet/:id',[authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
  
    let id = req.body.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide pet id' });
    }
    dbConn.query('DELETE FROM Pet WHERE id = $1', [id], function (error, results, fields) {
        if (error) throw error;

        // check data updated or not
        let message = "";
        if (results.rows.length === 0)
            message = "Pet not found";
        else
            message = "Pet successfully deleted";

        return res.send({ error: false, data: results.rows, message: message });
    });
});

//cage in pet
app.post('/api/pet/cage_in', [authJwt.verifyToken,authJwt.isSUPER],function (req, res) {

        let Pet_id = req.body.Pet_id;	
        let cage_id = req.body.cage_id;	
        let enter_date = dateTime;	
        let number_of_days = req.body.number_of_days;	
        let leaving_date = req.body.leaving_date;
        let created_at = dateTime;
        let updated_at = dateTime;
        let available = false;
        let sign_out = 'IN'; 

        dbConn.query(
            'SELECT * from cage_in_pet where cage_in_pet.Pet_id = 1$', [Pet_id], function (error, results, fields) {
            if (error) throw error;

            // check has data or not
            let message = "";
            if (results === undefined || results.length === 0){                      // validation
                if (!Pet_id)
                    return res.status(400).send({ error:true, message: 'Please provide a valid Pet_id'});
                if(!cage_id)
                    return res.status(400).send({ error:true, message: 'Please provide cage_id'});
                if (!number_of_days)
                    return res.status(400).send({ error:true, message: 'Please provide number_of_days'});
                // insert to db

                dbConn.query("INSERT INTO cage_in_pet(Pet_id,cage_id,sign_out,enter_date,number_of_days,leaving_date,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", 
                [Pet_id,cage_id,sign_out,enter_date,number_of_days,leaving_date,created_at,updated_at], 
                function (error, results, fields) {
                    if (error) throw error;

                    dbConn.query("UPDATE cage SET 	available=1$ WHERE id = $2",[available,cage_id])

                    return res.send({ error: false, data: results.rows, message: 'Pet successfully cage in' });
                });
            }else if(results[0].sign_out ==="OUT"){
                dbConn.query("UPDATE cage_in_pet SET cage_id=$1,sign_out=$2,enter_date=$3,number_of_days=$4,leaving_date=$5,updated_at=$6",
                [cage_id,sign_out,enter_date,number_of_days,leaving_date,updated_at])
                return res.send({ error: false, data: results.rows[0], message: 'Pet successfully cage in' }); 
            }else{ return res.send({ error: false, data: results.rows[0], message: 'Pet already cage in' })}
        });
    });

    //cage out pet
    app.post('/api/pet/out/:id', [authJwt.verifyToken,authJwt.isSUPER],function (req, res) {
         let id = req.body.id;
         let sign_out = 'OUT'; 
        dbConn.query("SELECT id	as cage_in_pet_id,Pet_id,cage_id,enter_date,number_of_days,leaving_date from cage_in_pet where id=$1",[id], function (error, results, fields) {
            if (error) throw error;
            if(results.rows !== undefined || results.rows.length !== 0){
                const available = true;
                dbConn.query("UPDATE cage_in_pet SET sign_out = ? where cage_in_pet.id = ?",[sign_out,id]);
                dbConn.query("INSERT INTO cage_out_pet(cage_in_pet_id,Pet_id,cage_id,enter_date,number_of_days,leaving_date,sign_out_date) VALUES($1,$2,$3,$4,$5,$6,$7)",
                [results.rows[0].cage_in_pet_id,results.rows[0].Pet_id,results.rows[0].cage_id,results.rows[0].enter_date,results.rows[0].number_of_days,results.rows[0].leaving_date,dateTime]);
                dbConn.query("UPDATE cage SET available = ? WHERE cage.id = ?",[available,results.rows[0].cage_id]);
            }
            return res.send({ error: false, data: results.rows, message: 'Pet Sign Out' }); 
            
        });
    });

      //get all pet of particular type sign-in
    app.get('/api/pet/:pet_type_id', [authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
    
        let pet_type_id = req.params.pet_type_id;
    
        dbConn.query(
            "SELECT cage_in_pet.id as id,Pet.id as pet_id,Pet.name,pet_type.type_name as pet_type,wieght,Pet.date_of_birth,note,cage.name as cage,capacity,address, enter_date,number_of_days,leaving_date,cage_in_pet.created_at,cage_in_pet.updated_at FROM Pet,cage_in_pet,cage,pet_type WHERE Pet.pet_type_id =$1 AND Pet.pet_type_id=pet_type.id AND Pet.id = cage_in_pet.Pet_id AND cage_in_pet.cage_id = cage.id AND cage_in_pet.sign_out='IN'", [pet_type_id], function (error, results, fields) {
            if (error) throw error;

            // check has data or not
            let message = "";
            if (results.rows[0] === undefined || results.rows[0].length == 0)
                message = "Cages are empty";
            else
                message = "Successfully retrived pet data";
            return res.send({ error: false, data: results.rows, message: message });
        });
    });

}