const myDb = require('../utils/connection');
const cTable = require('console.table');

// One constructor that will work for all tables

class dbQuery {
    constructor(info) {
        this.db = info;
    }
    
    queryDb() { 
        let db = this.db;
        
        // simple query
        const query = myDb.query(db, (err, results) => {
            if (err) throw err; 
            console.log('\r');
            console.table(results);
        });

        return query;
    }  
}

//const connect = new dbQuery('SELECT * FROM department');
//console.log(connect.getDepartments());

module.exports = dbQuery;