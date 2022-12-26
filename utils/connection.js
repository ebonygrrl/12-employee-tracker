// app module
const mysql = require('mysql2');

const db = mysql.createConnection({        
    host: 'localhost',
    user: 'root',
    password: '4HRZgdAa',
    database: 'employee_tracker'
});

db.connect((err) => {
    if (err) { throw err; }
    console.log("database connected!");
});

//console.log(db);

module.exports = db;