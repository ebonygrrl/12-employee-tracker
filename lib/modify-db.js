const myDb = require('../utils/connection');
const dbQuery = require('./query-db');

class modifyDb extends dbQuery{
    constructor(info, userInput) {
        super(info)
        this.userInput = userInput;
    }

    addDept() {
        let db = this.db;
        let userInput = this.userInput;

        // check if entry already exist
        //console.log(db);
        let output = myDb.query(db, (err, sql) => {
            if (err) throw err;
        });

        if (output.sql.length > 0) {
            console.log('/n/n Department name already exist.');
        } else {
            db = `INSERT INTO department (dept_name) VALUES ('${userInput}')`;
            let newQuery = myDb.query(db, (err, sql) => {
                if (err) throw err;
            });
            console.log(`${userInput} has been add to departments!`);
        }
    
        myDb.end();

        return output;
    }

    // Add employee to table
    // insertInto() {
    //     let sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ('NULL', ${this.fname}, ${this.lname}, ${this.role}, ${this.manager});`;

    //     return sql;
    // }

    // deleteFrom() {
    //     let sql = `DELETE FROM employee WHERE id = '${this.id}';`;

    //     return sql;
    // }

    // updateData() {
    //     let sql = `UPDATE employee SET address = 'Canyon 123' WHERE address = 'Valley 345';`;
    //     return this.constructor.name;
    // }

}

//const connect = new dbQuery(`SELECT * FROM department' WHERE dept_name = 'Sales'`');
//console.log(connect.addDept());

module.exports = modifyDb;