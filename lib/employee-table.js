class employeeTable {
    constructor(id, fname, lname, role, manager) {
        this.id     = id;
        this.fname  = fname;
        this.lname  = lname;
        this.role   = role;
        this.manager = manager;
    }

    // Add employee to table
    insertInto() {
        let sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ('NULL', ${this.fname}, ${this.lname}, ${this.role}, ${this.manager});`;

        return sql;
    }
    
    selectFrom() {
        return `SELECT * FROM employee;`;
    }

    deleteFrom() {
        let sql = `DELETE FROM employee WHERE id = '${this.id}';`;

        return sql;
    }

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

module.exports = employeeTable;