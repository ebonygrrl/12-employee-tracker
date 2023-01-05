// database connection
const myDbConfig = require('./utils/connection');

// get class
const dbQuery = require('./lib/query');

// wire db connection to query class
let myDb = new dbQuery(myDbConfig);

// app modules
const inquirer = require('inquirer');
const cTable = require('console.table');

// inquirer choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role', 'Exit'];
let selectDepts = [];
let selectRoles = [];
let selectEmployee = [];

// inquirer questions
const addDepartmentQuestion = [
    {
        type: 'input',
        name: 'dept_name',
        message: 'What is the name of the department?'
    }
];

const addRoleQuestions = [
    // {
    //     type: 'input',
    //     name: 'role_name',
    //     message: 'What is the name of the role?'
    // },
    // {
    //     type: 'input',
    //     name: 'salary',
    //     message: 'What is the salary of the role?',
    //     validate(input) {
    //         if (/^\d+$/g.test(input)) {
    //             return true;
    //         }
    //         throw Error('Please enter numbers only.');
    //     },
    // },
    {
        type: 'list',
        name: 'role_dept',
        message: 'Which department does the role belong to?',
        choices: selectDepts,
    }
];

const addEmployeeQuesions = [
    {
        type: 'input',
        name: 'fname',
        message: 'What is the employee\'s first name?',
        validate(input) {
             if (/^[A-Z][a-z]+$/g.test(input)) {
                 return true;
             }
             throw Error('Please be sure name is capitalized and enter first name only.');
        },
    },
    {
        type: 'input',
        name: 'lname',
        message: 'What is the employee\'s last name?',
        validate(input) {
             if (/^[A-Z][a-z]+$/g.test(input)) {
                 return true;
             }
             throw Error('Please be sure name is capitalized and enter last name only.');
        },
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is the employee\'s role?',
        choices: selectRoles,
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Who is the employee\'s manager?',
        choices: selectEmployee,
    }
];

const updateRoleQuestions = [
    {
        type: 'list',
        name: 'employee',
        message: 'Which employee\'s role do you want to update?',
        choices: selectEmployee,
    },
    {
        type: 'list',
        name: 'new_role',
        message: 'Which role do you want to assign the selected employee?',
        choices: selectRoles,
    }
];

// start here
const init = () => {
    // get db fields populate arrays
    let promise1 = new Promise((res, rej) => {
        if(err) rej(err);

        res(getViews('department'));
    });

    let promise2 = new Promise((res, rej) => {
        if(err) rej(err);

        res(getViews('role'));
    });

    let promise3 = new Promise((res, rej) => {
        if(err) rej(err);

        res(getViews('employee'));
    });

    let promise4 = new Promise((res, rej) => {
        if(err) rej(err);

        res(menu());
    });

    Promise.all([promise1, promise2, promise3, promise4])
};

const menu = () => {
    // main menu
    inquirer.prompt([{
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: initOptions,
    }]).then(answer => {   

        switch(answer.start) {
            case 'View All Departments':
                getViews('department', true, true);
                break;
            case 'View All Roles':
                getViews('role', true, true);
                break;
            case 'View All Employees':
                getViews('employee', true, true);
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add An Employee':
                addEmployee();
                break;
            case 'Update An Employee Role':
                updateEmployee();
                break;
            case 'Exit':
                myDb.end();
                break;         
        }
    });
}

const getViews = (table, display, timeout) => {
    let deptQuery = `SELECT * FROM ${table}`;
    let roleQuery = `SELECT r.id, r.title AS role, r.salary, d.id, d.dept_name AS department FROM role r INNER JOIN department d USING(dept_name)`;
    let employeeQuery = ``;

    let myQuery = (table === 'department') ? deptQuery : (table === 'role') ? roleQuery : employeeQuery;
    console.log(myQuery);

    // myDb class, queryDb method
    myDb.queryDb(myQuery)
        .then(results => { 
            // only show table when desired
            if (display) console.table(results); 

            // populate arrays
            switch(table) {
                case 'department':
                    selectDepts = []; // clear array before push to avoid duplicate entries
                    results.forEach((i) => {
                        //console.log(i.dept_name);
                        selectDepts.push(i.dept_name);
                    });
                    //console.log(selectDepts);
                    break;
                case 'role':
                    selectRoles = [];
                    results.forEach((i) => {
                        //console.log(i);
                        selectRoles.push(i.title);
                    });
                    //console.log(selectRoles);
                    break;
                case 'employee':
                    selectEmployee = [];
                    results.forEach((i) => {
                        //console.log(`${i.last_name}, ${i.first_name}`);
                        let employeeName = `${i.last_name}, ${i.first_name}`
                        selectEmployee.push(employeeName);
                    });
                    //console.log(selectEmployee);
                    break;
            } 

        })
        .catch(err => { throw err });
        //.then(() => { myDb.end() });

    if (timeout) setTimeout(() => {menu()}, 1000);
}

const addDepartment = () => {
    inquirer
        .prompt(addDepartmentQuestion)
        .then(answer => {
            // check if entry already exist
            myDb.queryDb(`SELECT dept_name FROM department WHERE EXISTS (SELECT * FROM department WHERE dept_name = '${answer.dept_name}')`)
                .then(results => {
                //console.log(results[0].length);
                if (results.length > 0) {
                    console.log('\n Department already exist in database. \n');
                } else { 
                    myDb.queryDb(`INSERT INTO department(dept_name) VALUES ('${answer.dept_name}')`)
                        .then(() => {
                            console.log(`\n ${answer.dept_name} was successfully added to Departments. \n`);
                        })
                        .catch(err => { throw err })
                        //.then(() => { myDb.end });
                }
            })
            .catch(err => { throw err })            
            .then(() => { getViews('department', false, true) });
        });   
};

const addRole = () => {
    inquirer
        .prompt(addRoleQuestions)
        .then(answers => {
            // check if role name already exist
            myDb.queryDb(`SELECT title FROM role WHERE EXISTS (SELECT * FROM role WHERE title = '${answers.role_name}')`)
                .then(results => {
                    if (results.length > 0) {
                        console.log('\n Role already exist in database. \n');
                    } else { 
                        myDb.queryDb(`INSERT INTO role(title) VALUES ('${title}, ${salary}, ')`)
                            .then(() => {
                                console.log(`\n ${answers.role_name} was successfully added to Roles. \n`);
                            })
                            .catch(err => { throw err })
                            //.then(() => { myDb.end });
                    }
                })        
            .then(() => { getViews('role', false, true) })
            .catch(err => { throw err });
        });   
};

const addEmployee = () => {
    inquirer
        .prompt(addEmployeeQuesions)
        .then(answers => {
            // check if employee already exist

        });
        // connect = new dbQuery('INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ('NULL', ${this.fname}, ${this.lname}, ${this.role}, ${this.manager});');
        // connect.addEmployee();
        // function
};

const updateEmployee = () => {
    inquirer
        .prompt(updateRoleQuestions)
        .then(answers => {

        });
    // connect = new dbQuery('UPDATE employee SET address = 'Canyon 123' WHERE address = 'Valley 345'');
    // connect.updateEmployee();
    // function 
};

init();