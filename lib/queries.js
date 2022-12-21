const myDatabase = require('../utils/connection');

console.log(myDatabase);

// One constructor that will work for all tables

class Queries {
    constructor(myDatabase) {
        this.db = myDatabase;
    }
    
    getDepartments() { 
        let db = this.db;
        console.log(this.db);
        
        //simple query
        db.query('SELECT * FROM department', (err, results) => {
            if (err) throw err;

            console.log(results);
            
            //let newSql = results.map((item) => ({ id: item.id, name: item.dept_name }));
    
            //console.table(newSql);
        });
    }
    
    // const getRoles = () => {  
    //     // simple query
    //     db.query('SELECT * FROM role', (err, results) => {
    //             if (err) throw err;
    //             //console.log(results); // results contains rows returned by server
    //             showRoleTables(results);
    //         }
    //     );
    // }
    
    // const getEmployees = () => {  
    //     // simple query
    //     db.query('SELECT * FROM employee', (err, results) => {
    //             if (err) throw err;
    //             //console.log(results); // results contains rows returned by server
    //             showEmployeeTables(results);
    //         }
    //     );
    // }

    // Add employee to table
    // insertInto() {
    //     let sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ('NULL', ${this.fname}, ${this.lname}, ${this.role}, ${this.manager});`;

    //     return sql;
    // }
    
    // selectFrom() {
    //     return `SELECT * FROM employee;`;
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

// const getDepartments = () => { 
//     // simple query
//     db.query(
//         'SELECT * FROM department',
//         function (err, results, fields) {
//             if (err) throw err;
//             //console.log(results); // results contains rows returned by server
//             showDeptTables(results);
//         }
//     );
// }


// const staff = new Employee('Tori',1,'email@email.com');
// console.log(staff);
// console.log(staff.getName());
// console.log(staff.getId());
// console.log(staff.getEmail());

//const connect = new Queries('View All Departments');
//console.log(connect.getDepartments());

//module.exports = Queries;