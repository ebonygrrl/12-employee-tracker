const myDatabase = require('../utils/connection');

//console.log(myDatabase);

// One constructor that will work for all tables

class dbQuery {
    constructor(info) {
        this.db = info;
    }
    
    getDepartments() { 
        let db = this.db;
        
        //simple query
        let select = myDatabase.query(db, (err, results) => {
            if (err) throw err;

            console.log(results);
            
            //let newSql = results.map((item) => ({ id: item.id, name: item.dept_name }));
    
            //console.table(newSql);
        });
        return select;
    }    
}
    const connect = new dbQuery('SELECT * FROM department');
    console.log(connect.getDepartments());
    //console.log(connect);
        

        //return select;
    //}
    
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
//}

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

// const connect = new dbQuery('SELECT * FROM department');
// console.log(getDepartments());

//module.exports = dbQuery;