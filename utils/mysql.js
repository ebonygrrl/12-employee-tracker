const mysql = require('mysql2');
const showTables = require('./tables');

const getDepartments = () => {  

// create the connection to database
const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '4HRZgdAa',
      database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker database.`)
  );

    //console.log('connect');
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

module.exports = getDepartments;