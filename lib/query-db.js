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
}

module.exports = dbQuery;