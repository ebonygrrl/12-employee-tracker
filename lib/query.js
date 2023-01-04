const myDb = require('../utils/connection');
const cTable = require('console.table');

class dbQuery {
    constructor(info) {
        this.db = info;
    }
    
    queryDb() {
        myDb.promise().query(this.db)
            .then(results => { console.table(results[0]); })
            .catch(err => { throw err })
            .then(() => { myDb.end });
    } 
}

//const connect = new dbQuery('SELECT * FROM department');
//connect.queryDb();

module.exports = dbQuery;