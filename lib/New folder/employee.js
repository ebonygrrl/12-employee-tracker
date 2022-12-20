class Employee {
    constructor(fname, lname, manager) {
        this.fname  = fname;
        this.lname  = lname;
        this.manager = manager;
    }

    // TODO: First name only, no spaces, capitalized
    getName() {

    }
    
    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getRole() {
        // get the class name of this object
        return this.constructor.name;
    }
}

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


// const staff = new Employee('Tori',1,'email@email.com');
// console.log(staff);
// console.log(staff.getName());
// console.log(staff.getId());
// console.log(staff.getEmail());

module.exports = Employee;