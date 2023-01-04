const myDb = require('../utils/connection');

class dbQuery {
    constructor(info) {
        this.db = info;
    }
    
    queryDb(sql, arg) {
        // set up promise
        return new Promise((res, rej) => {

            // simple query
            myDb.query(sql, arg, (err, results) => {
                if (err) {
                    return rej(err);
                }

                res(results);
            });
        });
        // myDb.promise().query(this.db)
        //     .then(results => { console.table(results[0]); })
        //     .catch(err => { throw err })
        //     .then(() => { myDb.end });
    } 

    end() {
        return new Promise((res, rej) => {

            // simple query
            myDb.end(err => {
                if (err) {
                    return rej(err);
                }

                res();
            });
        });
    }
}

module.exports = dbQuery;