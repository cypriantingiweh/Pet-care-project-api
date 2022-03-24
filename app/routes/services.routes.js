var  dbConn = require('../../server');
const authJwt = require('../middleware/authJwt.js');

var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var dateTime = date_ob.getFullYear() + "-" + month + "-" + day + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();

module.exports = (app) => {
    // add a new cage  
    app.post('/api/normal_services/register', [authJwt.verifyToken,authJwt.isSUPER],function (req, res) {

        let  name = req.body.name;
        let description = req.body.description;
        let pet_type_id = req.body.pet_type_id;
        let cost = req.body.cost;	
        let created_at = dateTime;
        let updated_at = dateTime;


        // validation
        if (!name)
            return res.status(400).send({ error:true, message: 'Please provide a name'});
        if (!description)
            return res.status(400).send({ error:true, message: 'Please provide a description'});
        if (!cost)
            return res.status(400).send({ error:true, message: 'Please provide the cost'});
    

        dbConn.query("INSERT INTO normal_services(name,description,cost,created_at,updated_at,pet_type_id) VALUES ($1,$2,$3,$4,$5,$6)", 
        [name,description,cost,created_at,updated_at,pet_type_id], 
        function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results.rows, message: 'Services successfully added' });
        });
    });

    app.put('/api/normal_services/update/:id', [authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
  
        let id = req.body.id;
        let name = req.body.name;
        let description= req.body.description;
        let cost =req.body.cost;
        let pet_type_id = req.body.pet_type_id;
        let updated_at = dateTime;
    
        dbConn.query("UPDATE normal_services SET name=$1, description=$2,cost=$3,updated_at=$4,pet_type_id=$5 WHERE id = $6", 
        [name,description,cost,updated_at,pet_type_id,id], function (error, results, fields) {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0)
                message = "services type not found or data are same";
            else
                message = "services type successfully updated";

            return res.send({ error: false, data: results.rows, message: message });
        });
    });

     // delete cage by id
    app.delete('/api/normal_services/:id',[authJwt.verifyToken,authJwt.isSUPER], function (req, res) {
  
    let id = req.body.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide Service id' });
    }
        dbConn.query('DELETE FROM normal_services WHERE id = $1', [id], function (error, results, fields) {
            if (error) throw error;

            // check data updated or not
            let message = "";
            if (results.rows === 0)
                message = "service not found";
            else
                message = "service successfully deleted";

            return res.send({ error: false, data: results.rows, message: message });
        });
    });

    //get all services of particular

    app.get('/api/normal_services/:pet_type_id', function (req, res) {
    
        dbConn.query("SELECT * FROM  normal_services where pet_type_id = $1",[req.params.pet_type_id], function (error, results, fields) {
            if (error) throw error;

            // check has data or not
            let message = "";
            if (results.rows === undefined || results.rows.length == 0)
                message = "Services not found";
            else
                message = "Successfully retrived services type data";
            return res.send({ error: false, data:results.rows, message: message });
        });
    });

    app.post('/api/provide/service', [authJwt.verifyToken,authJwt.isSUPER],function (req, res) {

        dbConn.query("INSERT INTO provide(services_id,pet_cage_id,extra_service,number_oftimes_per_day,updated_at,created_at) VALUES ($1)", 
        [req.body.services_id.map(item =>[item.services_id,item.pet_cage_id,item.extra_service,item.number_oftimes_per_day,dateTime,dateTime])], 
        function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results.rows, message: 'Services successfully added' });
        });
    });

    app.get('/api/provide/service_cost/:id', [authJwt.verifyToken,authJwt.isSUPER],function (req, res) {
        var sql = "SELECT Pet.name as pet, Pet.wieght,Pet.date_of_birth,cage_in_pet.number_of_days,cage_in_pet.enter_date,cage_in_pet.leaving_date,pet_type.type_name,normal_services.name as service_name,provide.number_oftimes_per_day,normal_services.cost, normal_services.cost*cage_in_pet.number_of_days AS total FROM normal_services, Pet, provide,cage_in_pet,pet_type WHERE Pet.id =$1 AND Pet.id = cage_in_pet.Pet_id AND cage_in_pet.id = provide.pet_cage_id AND provide.services_id = normal_services.id AND Pet.pet_type_id = pet_type.id"
        dbConn.query(sql, [req.params.id], 
        function (error, results, fields) {
            if (error) throw error;
            if(results.rows.length){
                var service = []
                var total_service_charge = 0;
                results.rows.forEach(element => {
                    service.push({
                        service_name:element.service_name,
                        number_oftimes_per_day:element.number_oftimes_per_day,
                        cost:element.cost,
                        total: element.number_oftimes_per_day!=0 ? element.total*element.number_oftimes_per_day:element.total
                    });

                total_service_charge += element.number_oftimes_per_day!=0 ? element.total*element.number_oftimes_per_day : element.total;
                    });

                var data ={
                            Pet_name:results.rows[0].pet,
                            wieght: results.rows[0].wieght,
                            date_of_birth: results.rows[0].date_of_birth,
                            number_of_days: results.rows[0].number_of_days,
                            enter_date: results.rows[0].enter_date,
                            leaving_date: results.rows[0].leaving_date,
                            type_name: results.rows[0].type_name,
                            total_service_charge:total_service_charge,
                            services:service
                            
                        }
                
                return res.send({ error: false, data: data, message: 'Services successfully added' });
                }else{
                    return res.send({ error: false, data: results, message: 'No Bills found' });
                }
            });
    });
}