// app module
const mysql = require('mysql2');
// mysql login cred
const connection = require('./connection');
// deconstruct table objects
//const { showDeptTables, showRoleTables, showEmployeeTables } = require('./tables');

const connected = () => {
//create the connection to database
const db = mysql.createConnection(connection);

//console.log(db);

db.connect((err) => {
  if (err) { throw err; }
  //console.log("database connected!");
});

return db;
}

// const getDepartments = () => { 
//     //simple query
//     db.query('SELECT * FROM department', (err, results) => {
//         if (err) throw err;
//         //console.log(results); // results contains rows returned by server
//         showDeptTables(results);
//     });
// }

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

// export to index as an object
module.exports = connected;



// https://stackoverflow.com/questions/67529729/mysql2-nodejs-how-to-build-a-complex-query
// const sql = `
//     INSERT INTO table (url, caption, username, type, timestamp)
//     VALUES (?, ?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE;
// `;

// data.foreach(item => {
//   conn.query(sql, [item.url, item.caption, item.username, item.type, item.timestamp], callback);
// });