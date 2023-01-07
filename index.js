// database connection
const myDbConfig = require('./utils/connection');

// get class
const dbQuery = require('./lib/query');
const dbViews = require('./lib/query-view');

// wire db connection to query class
let myDb = new dbQuery(myDbConfig);

// app modules
const inquirer = require('inquirer');
const cTable = require('console.table');

// inquirer choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role', 'Exit'];
let selectDepts, selectRoles, selectEmployee;
let deptList = [];
let roleList = [];
let employeeList = [];

// inquirer questions
const addDepartmentQuestion = [
    {
        type: 'input',
        name: 'dept_name',
        message: 'What is the name of the department?'
    }
];

const addRoleQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
        validate(input) {
            if (/^\d+$/g.test(input)) {
                return true;
            }
            throw Error('Please enter numbers only.');
        },
    },
    {
        type: 'list',
        name: 'role_dept',
        message: 'Which department does the role belong to?',
        choices: deptList,
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
        choices: roleList,
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Who is the employee\'s manager?',
        choices: employeeList,
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
const init = async () => {
    // get db fields populate arrays
    await getDept();
    await getRole();
    await getEmployee();

    //menu();
    addEmployee();
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
                getDept(true, true);
                break;
            case 'View All Roles':
                getRole(true, true);
                break;
            case 'View All Employees':
                getEmployee(true, true);
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

const getDept = (display, timeout) => {      
    
    if (timeout) setTimeout(() => {menu()}, 1000);

    // myDb class, queryDb method
    return myDb.queryDb(`SELECT d.id, d.dept_name AS department FROM department d ORDER BY d.id ASC`)
        .then(results => { 
            // only show table when desired
            if (display) { console.log('\n'); console.table(results); }

            selectDepts = results;
        })
        .catch(err => { throw err });      
}

const getRole = (display, timeout) => {

    if (timeout) setTimeout(() => {menu()}, 1000);

    return myDb.queryDb(`SELECT r.id, r.title, d.dept_name AS department, r.salary FROM role r INNER JOIN department d ON r.department_id = d.id ORDER BY r.id ASC`)
        .then(results => { 
            // only show table when desired
            if (display) { console.log('\n'); console.table(results); } 

            selectRoles = results;
        })
        .catch(err => { throw err });
}

const getEmployee = (display, timeout) => {

    if (timeout) setTimeout(() => {menu()}, 1000);

    let employeeQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.last_name ASC`;

    // myDb class, queryDb method
    return myDb.queryDb(employeeQuery)
        .then(results => { 
            // only show table when desired
            if (display) { console.log('\n'); console.table(results); } 

            // populate arrays
            selectEmployee = results;
        })
        .catch(err => { throw err });
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
                }
            })           
            .then(() => { getDept() })
            .catch(err => { throw err });
        });   
};

const addRole = () => {
    let departmentId;

    //populate array
    selectDepts.forEach((i) => {
        deptList.push(i.department);               
    });
    
    inquirer
        .prompt(addRoleQuestions)
        .then(answers => {
            // get department id
            myDb.queryDb(`SELECT id FROM department WHERE dept_name = '${answers.role_dept}'`)
                .then(results => {
                    departmentId = results[0].id;
                })
                .catch(err => { throw err });

            // check if role name already exist
            myDb.queryDb(`SELECT title FROM role WHERE EXISTS (SELECT * FROM role WHERE title = '${answers.title}')`)
                .then(results => {
                    if (results.length > 0) {
                        console.log('\n Role already exist in database. \n');
                    } else { 
                        myDb.queryDb(`INSERT INTO role(title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${departmentId})`)
                            .then(() => {
                                console.log(`\n ${answers.title} was successfully added to Roles. \n`);
                            })
                            .catch(err => { throw err });
                    }
                })        
            .then(() => { init() })
            .catch(err => { throw err });
        });           
};


// Tori, add 'None' to Employee List for Managers
// Line 321 returns error of undefined (not found in db)

// console.log('name: ' + name);            

// console.log('temp: ' + temp);

// console.log(fname, lname);

// name: Renee Aguirre
// temp: Renee,Aguirre
// undefined undefined
// [] Line 332 results

const addEmployee = () => {

    let roleId, employeeName, managerId;
    
    // populate arrays
    selectRoles.forEach((i) => {
        roleList.push(i.title);               
    });

    // concat first and last names to build employeeList
    selectEmployee.forEach((i) => {
        employeeName = `${i.first_name} ${i.last_name}`;
        employeeList.push(employeeName);               
    });    

    inquirer
        .prompt(addEmployeeQuesions)
        .then(answers => {

            // get role id
            myDb.queryDb(`SELECT id FROM role WHERE title = '${answers.role}'`)
                .then(results => {
                    roleId = results[0].id;
                })
                .catch(err => { throw err });

            // separate employee name for db query
            let name = answers.manager;
            console.log('name: ' + name);
            
            let temp = name.split(' ');
            console.log('temp: ' + temp);
            
            let fname = temp[0].first_name;
            let lname = temp[1].last_name;

            console.log(fname, lname);

            // get manager id
            myDb.queryDb(`SELECT id FROM employee WHERE first_name = '${fname}' AND last_name = '${lname}'`)
                .then(results => {
                    console.log(results);
                    managerId = results[0].id;
                })
                .catch(err => { throw err });

            //check if employee already exist
            // myDb.queryDb(`SELECT id FROM employee WHERE EXISTS (SELECT * FROM employee WHERE first_name = '${fname}' AND last_name = '${lname}')`)
            //     .then(results => {
            //         if (results.length > 0) {
            //             console.log('\n Employee already exist in database. \n');
            //         } else { 
            //             myDb.queryDb(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.fname}', '${answers.lname}', ${roleId}, ${managerId})`)
            //                 .then(() => {
            //                     console.log(`\n ${name} was successfully added to Employees. \n`);
            //                 })
            //                 .catch(err => { throw err });
            //         }
            //     })        
            // .then(() => { init() })
            // .catch(err => { throw err });
        });   
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