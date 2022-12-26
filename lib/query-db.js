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
}

//const connect = new dbQuery('SELECT * FROM department');
//console.log(connect.getDepartments());

module.exports = dbQuery;