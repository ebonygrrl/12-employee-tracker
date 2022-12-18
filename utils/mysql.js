const mysql = require('mysql2');
const cTable = require('console.table');

// create the connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '4HRZgdAa',
    database: 'employee_tracker'
},
    console.log(`Connected to the employee_tracker database.`)
);

const getDepartments = () => { 
    // simple query
    db.query(
        'SELECT * FROM department',
        function (err, results, fields) {
            if (err) throw err;
            //console.log(results); // results contains rows returned by server
            showDeptTables(results);
        }
    );
}

const getRoles = () => {  
    // simple query
    db.query(
        'SELECT * FROM role',
        function (err, results, fields) {
            if (err) throw err;
            //console.log(results); // results contains rows returned by server
            showDeptTables(results);
        }
    );
}

const getEmployees = () => {  
    // simple query
    db.query(
        'SELECT * FROM employee',
        function (err, results, fields) {
            if (err) throw err;
            //console.log(results); // results contains rows returned by server
            showDeptTables(results);
        }
    );
}

module.exports = function() {
    getDepartments();
    getRoles();
    getEmployees();
};