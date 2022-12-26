const myDb = require('../utils/connection');
const cTable = require('console.table');

// One constructor that will work for all tables

class dbQuery {
    constructor(info) {
        this.db = info;
    }
    
    getDepartments() { 
        let db = this.db;
        
        // simple query
        myDb.query(db, (err, sql) => {
            if (err) throw err; 
            
            // map database columns
            let newSql = sql.map((item) => ({ id: item.id, name: item.dept_name }));    
            console.table(newSql);
        });

        // end connection
        myDb.end();
    }  
    
    getRoles() {  
        let db = this.db;

        myDb.query(db, (err, sql) => {
            if (err) throw err;

            let newSql = sql.map((item) => ({ id: item.id, title: item.title, salary: item.salary}));
            console.table(newSql);
        });
        
        myDb.end();
    }
    
    getEmployees() {  
        let db = this.db;
        
        myDb.query(db, (err, sql) => {
            if (err) throw err;

            let newSql = sql.map((item) => ({ 
                id: item.id, 
                first: item.first_name, 
                last: item.last_name, 
                title: item.title, 
                department: item.dept_name, 
                salary: item.salary,
                manager: item.manager_id 
        }));

            console.table(newSql);
        });
        
        myDb.end();
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

// const connect = new dbQuery('SELECT * FROM department');
// console.log(connect.getDepartments());

module.exports = dbQuery;