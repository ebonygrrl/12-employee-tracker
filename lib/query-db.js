const myDb = require('../utils/connection');
const cTable = require('console.table');

class dbQuery {
    constructor(info) {
        this.db = info;
    }
    
    queryDb() {         
        // simple query
        const query = myDb.query(this.db, (err, results) => {
            if (err) throw err; 
            console.log('\r');
            console.table(results);
        });

        return query;
    } 
    
    queryDbArr() {  
        
        // simple query
        const query = [];
        myDb.query(this.db, (err, results) => {
            if (err) throw err; 
            console.log('\r');
            for (let i=0; i < results.length; i++ ) {
                let data = results[i].dept_name;

                query.push(data);
            }

            //console.log(query);
        });

        return query;
    } 
}

const connect = new dbQuery('SELECT * FROM department');
connect.queryDbArr();

module.exports = dbQuery;