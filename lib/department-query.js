const myDb = require('../utils/connection');
const dbQuery = require('./query');

class Department extends dbQuery{
    constructor(info) {
        super(info);
    }    

    addDept = (val) => {
        // check if entry already exist
        myDb.promise().query(this.db)
            .then(results => {
                //console.log(results[0].length);
                if (results[0].length > 0) {
                console.log('\n Department already exist in database. \n');
                } else { 
                    this.db = `INSERT INTO department(dept_name) VALUES ('${val}')`;
                    myDb.promise().query(this.db)
                        .then(() => {
                            console.log(`\n ${val} was successfully added to Departments. \n`);
                        })
                        .catch(err => { throw err })
                        .then(() => { myDb.end });
                }
            })
            .catch(err => { throw err })
            .then(() => { myDb.end });
    }
}

module.exports = Department;