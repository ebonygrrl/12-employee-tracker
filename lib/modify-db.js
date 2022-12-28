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
        let output = myDb.query(db, (err, results) => {
            if (err) throw err;
        });

        if (output.results.length > 0) {
            console.log('\n Department name already exist in database. \n');
        } else {
            db = `INSERT INTO department (dept_name) VALUES ('${userInput}')`;
            myDb.query(db, (err, results) => {
                if (err) throw err;
            });
            console.log(`${userInput} has been add to departments!`);
            console.log('\r');
            init();
        }
    }

    addRole() {
        let db = this.db;
        let userInput = this.userInput;
        let title = userInput[0];
        let salary = userInput[1];
        let dept = userInput[2];

        //console.log(title,salary,dept);

        // check if entry already exist
        let output = myDb.query(db, (err, results) => {
            if (err) throw err;
        console.log(output.results, output.results.length);

        if (output.results.length > 0) {
            console.log('\n Employee position already exist in database. \n');
        } else {
            db = `INSERT INTO role (title, salary) VALUES ('${title}', '${salary}')`;
            myDb.query(db, (err, results) => {
                if (err) throw err;
            });

            myDb.query('SELECT LAST_INSERT_ID()', (err, results) => {
                if (err) throw err;
                console.log(results);
            });
            console.log(`${title} has been add to employee positions!`);
        }
    });
        //INSERT INTO role (id, title, salary, department_id) VALUES (1,'Sales Lead',60000,4),
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