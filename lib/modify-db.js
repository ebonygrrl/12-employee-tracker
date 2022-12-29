const myDb = require('../utils/connection');
const dbQuery = require('./query-db');

class modifyDb extends dbQuery{
    constructor(info, userInput) {
        super(info)
        this.userInput = userInput;
    }

    addDept(deptName) {

        // check if entry already exist
        let query = myDb.query(this.db, (err, results) => {
            if (err) throw err;
            
            if (results.length > 0) {
                console.log('\n Department already exist in database. \n');
            } else { 
                this.db = `INSERT INTO department(dept_name) VALUES ('${deptName}')`;
                query = myDb.query(this.db, (err, results) => {
                    if (err) throw err;
                    console.log('\r');
                    console.log(`${deptName} was successfully added to Departments.`);
                });
            }
        });

        return query;
    }

    // addRole(title, salary, dept) {
    //     // check if entry already exist
    //     let output = myDb.query(this.db, (err, results) => {
    //         if (err) throw err;
    //         console.log(results);
    //     });
        
    //     return output;
    // }

            // if (output.results.length > 0) {
            //     console.log('\n Employee position already exist in database. \n');
            // } else {
            //     db = `INSERT INTO role (title, salary) VALUES ('${title}', '${salary}')`;
            //     myDb.query(this.db, (err, results) => {
            //         if (err) throw err;
            //     });

            //     myDb.query('SELECT LAST_INSERT_ID()', (err, results) => {
            //         if (err) throw err;
            //         console.log(results);
            //     });
            //     console.log(`${title} has been add to employee positions!`);
            // }
        //INSERT INTO role (id, title, salary, department_id) VALUES (1,'Sales Lead',60000,4),

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

// const connect = new modifyDb(`SELECT dept_name FROM department EXISTS (SELECT dept_name FROM department WHERE dept_name = "Clothing")`);
// connect.addDept('Sales');

module.exports = modifyDb;