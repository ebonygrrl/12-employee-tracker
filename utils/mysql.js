const mysql = require('mysql2');
const connection = require('./connection');
const {showDeptTables, showRoleTables, showEmployeeTables} = require('./tables');

// create the connection to database

const db = mysql.createConnection(connection);

//console.log(db);

db.connect((err) => {
  if (err) { throw err; }
  //console.log("database connected!");
});

const getDepartments = () => { 
    //simple query
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        //console.log(results); // results contains rows returned by server
        showDeptTables(results);
    });
}

// const getRoles = () => {  
//     // simple query
//     db.query(
//         'SELECT * FROM role',
//         function (err, results, fields) {
//             if (err) throw err;
//             console.log(results); // results contains rows returned by server
//             showRoleTables(results);
//         }
//     );
// }

// const getEmployees = () => {  
//     // simple query
//     db.query(
//         'SELECT * FROM employee',
//         function (err, results, fields) {
//             if (err) throw err;
//             //console.log(results); // results contains rows returned by server
//             showEmployeeTables(results);
//         }
//     );
// }

module.exports = getDepartments;

//     getRoles();
//     getEmployees();
// };

// https://stackoverflow.com/questions/67529729/mysql2-nodejs-how-to-build-a-complex-query
// const sql = `
//     INSERT INTO table (url, caption, username, type, timestamp)
//     VALUES (?, ?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE;
// `;

// data.foreach(item => {
//   conn.query(sql, [item.url, item.caption, item.username, item.type, item.timestamp], callback);
// });