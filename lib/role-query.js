const myDb = require('../utils/connection');
const dbQuery = require('./query');

class Role extends dbQuery{
    constructor(info) {
        super(info);
    }    

    addRole (title, salary, dept) {
        // check if entry already exist
        myDb.promise().query(this.db)
            .then(results => {
                //console.log(results[0].length);
                if (results[0].length > 0) {
                console.log('\n Role already exist in database. \n');
                } else { 
                    this.db = `INSERT INTO role(title) VALUES ('${title}, ${salary}, ')`;
                    myDb.promise().query(this.db)
                        .then(() => {
                            console.log(`\n ${val} was successfully added to Roles. \n`);
                        })
                        .catch(err => { throw err })
                        .then(() => { myDb.end });
                }
            })
            .catch(err => { throw err })
            .then(() => { myDb.end });
    }
}

module.exports = Role;