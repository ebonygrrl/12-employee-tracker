//const app = require('../index');
const myDb = require('../utils/connection');
const cTable = require('console.table');

class dbQuery {
    constructor(info) {
        this.db = info;
    }
    
    queryDb() {    
        //console.log(this.db); 
        // simple query
        const query = myDb.query(this.db, (err, results) => {
            if (err) throw err; 
            console.log('\r');
            console.table(results);
        });

        return query;
    } 
    
    // queryDbArr() {  
    //     const promise = new Promise((resolve, reject) => {
    //         // simple query
            
    //         myDb.query(this.db, (err, results) => {
    //             if (err) throw err; 
                
    //             //queryOutput(results);
    //         });
    //     });
    // } 
}

//const connect = new dbQuery('SELECT * FROM department');
//connect.queryDbArr();

module.exports = dbQuery;