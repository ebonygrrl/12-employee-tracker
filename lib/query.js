const myDb = require('../utils/connection');

class dbQuery {
    constructor(db) {
        this.db = myDb;
    }
    
    queryDb(sql, arg) {
        // set up promise
        return new Promise((res, rej) => {

            // simple query
            this.db.query(sql, arg, (err, results) => {
                if (err) {
                    return rej(err);
                }

                res(results);
            });
        });
    } 

    end() {
        return new Promise((res, rej) => {

            // simple query
            this.db.end(err => {
                if (err) {
                    return rej(err);
                }

                res();
            });
        });
    }
}

module.exports = dbQuery;