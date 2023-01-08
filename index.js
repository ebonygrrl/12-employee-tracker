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
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'View All Managers', 'View Employees by Department', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role', 'Exit'];
let selectDepts, selectRoles, selectEmployee, selectManager;
let deptList = [];
let roleList = [];
let employeeList = [];
let managerList = [];

// start here
const init = async () => {
    // get db fields populate arrays
    await getDept();
    await getRole();
    await getEmployee();

    menu();
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
            case 'View All Managers':
                getManagers(true, true);
                break;
            case 'View Employees by Department':
                getEmployeesByDept();
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

const getManagers = async () => {
    
    let employeeName, managerId, first_name, last_name;

    // run query to get employees listed as managers to populate list
    await myDb.queryDb(`SELECT * FROM employee WHERE (id IN (SELECT manager_id FROM employee))`)
            .then(results => {
                selectManager = results;
            })
            .catch(err => { throw err });

    // concat first and last names to build managerList
    selectManager.forEach((i) => {
        employeeName = `${i.first_name} ${i.last_name}`;
        managerList.push(employeeName);    
    });

    await inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager\'s team would you like view?',
                choices: managerList,
            }
        ])
        .then(async (answer) => {
            // get id of name that matches
            let name = [answer.manager];
            let temp = name[0].split(' '); 
                
            first_name = temp[0];
            last_name = temp[1];  
            
            // get manager id
            await myDb.queryDb(`SELECT id FROM employee WHERE (first_name = '${first_name}' AND last_name = '${last_name}')`)
                .then(results => {
                    managerId = results[0].id;
                })
                .catch(err => { throw err });

            let employeeQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager 
            FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id WHERE e.manager_id = ${managerId};`;

            // myDb class, queryDb method
            await myDb.queryDb(employeeQuery)
                .then(results => { 
                    console.log('\n');
                    console.table(results); 
                })
                .then(() => {
                    managerList = []; 
                    menu(); 
                })
                .catch(err => { throw err }); 

            
    });
}

const getEmployeesByDept = () => {
    let deptId;

    //populate array
    selectDepts.forEach((i) => {
        deptList.push(i.department);               
    });

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'dept_name',
                message: 'Which department would you like view?',
                choices: deptList,
            }
        ])
        .then(async (answer) => {
            // get id of name that matches
            
            // get manager id
            await myDb.queryDb(`SELECT id FROM department WHERE (dept_name = '${answer.dept_name}')`)
                .then(results => {
                    deptId = results[0].id;
                })
                .catch(err => { throw err });

            let employeeQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager 
            FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id WHERE d.id = ${deptId};`;

            // myDb class, queryDb method
            await myDb.queryDb(employeeQuery)
                .then(results => { 
                    console.log('\n');
                    console.table(results); 
                })
                .then(() => {
                    deptList = []; 
                    menu(); 
                })
                .catch(err => { throw err }); 

            
    });
}

const addDepartment = () => {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept_name',
                message: 'What is the name of the department?'
            }
        ])
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
    
    inquirer
        .prompt(addRoleQuestions)
        .then(answers => {
            // get department id
            myDb.queryDb(`SELECT id FROM department WHERE (dept_name = '${answers.role_dept}')`)
                .then(results => {
                    departmentId = results[0].id;
                })
                .catch(err => { throw err });

            // check if role name already exist
            myDb.queryDb(`SELECT title FROM role WHERE EXISTS (SELECT * FROM role WHERE (title = '${answers.title}'))`)
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

const addEmployee = () => {

    let roleId, employeeName, managerId, first_name, last_name;
    
    // populate arrays
    selectRoles.forEach((i) => {
        roleList.push(i.title);               
    });

    // concat first and last names to build employeeList
    selectEmployee.forEach((i) => {
        employeeName = `${i.first_name} ${i.last_name}`;
        employeeList.push(employeeName);    
    });       

    employeeList.push('None');    

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

    inquirer
        .prompt(addEmployeeQuesions)
        .then(async (answers) => {

            //get role id
            await myDb.queryDb(`SELECT id FROM role WHERE (title = '${answers.role}')`)
                .then(results => {
                    roleId = results[0].id;
                })
                .catch(err => { throw err });

            if (answers.manager !== 'None') {
                // separate employee name for db query
                let name = [answers.manager];

                let temp = name[0].split(' '); 
                
                first_name = temp[0];
                last_name = temp[1];                

                // get manager id
                myDb.queryDb(`SELECT id FROM employee WHERE (first_name = '${first_name}' AND last_name = '${last_name}')`)
                    .then(results => {
                        managerId = results[0].id;
                    })
                    .catch(err => { throw err });
            } else {
                managerId = '';
            }

            // check if employee already exist
            myDb.queryDb(`SELECT id FROM employee WHERE EXISTS (SELECT * FROM employee WHERE (first_name = '${answers.fname}' AND last_name = '${answers.lname}'))`)
                .then(results => {
                    if (results.length > 0) {
                        console.log('\n Employee already exist in database. \n');
                    } else { 
                        myDb.queryDb(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.fname}', '${answers.lname}', ${roleId}, ${managerId})`)
                            .then(() => {
                                console.log(`\n ${answers.fname} ${answers.lname} was successfully added to Employees. \n`);
                            })
                            .catch(err => { throw err });
                    }
                })        
            .then(() => { init() })
            .catch(err => { throw err });
        });   
};

const updateEmployee = () => {

    let employeeName, employeeId, roleId, managerId, first_name, last_name;

    // concat first and last names to build employeeList
    selectEmployee.forEach((i) => {
        employeeName = `${i.first_name} ${i.last_name}`;
        employeeList.push(employeeName);    
    });

    // add none to employee list
    managerList = ['None', ...employeeList]; // this works, just doesn't get to inquirer prompt like the other two

    // fill role list
    selectRoles.forEach((i) => {
        roleList.push(i.title);               
    });

    const updateRoleQuestions = [
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee\'s role do you want to update?',
            choices: employeeList,
        },
        {
            type: 'list',
            name: 'new_role',
            message: 'Which role do you want to assign the selected employee?',
            choices: roleList,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employee\'s manager?',
            choices: managerList,
        }
    ];

    inquirer
        .prompt(updateRoleQuestions)
        .then(async (answers) => {
            console.log(managerList);
            // get id of name that matches
            let name = [answers.employee];
            let temp = name[0].split(' '); 
                
            first_name = temp[0];
            last_name = temp[1];

            // get employee id
            await myDb.queryDb(`SELECT id FROM employee WHERE (first_name = '${first_name}' AND last_name = '${last_name}')`)
                .then(results => {
                    employeeId = results[0].id;
                })
                .catch(err => { throw err });

            // get id of new role
            await myDb.queryDb(`SELECT id FROM role WHERE (title = '${answers.new_role}')`)
                .then(results => {
                    roleId = results[0].id;
                })
                .catch(err => { throw err });
            
            if (answers.manager !== 'None') {
                // separate employee name for db query
                let name = [answers.manager];

                let temp = name[0].split(' '); 
                
                first_name = temp[0];
                last_name = temp[1];                

                // get manager id
                await myDb.queryDb(`SELECT id FROM employee WHERE (first_name = '${first_name}' AND last_name = '${last_name}')`)
                    .then(results => {
                        managerId = results[0].id;
                    })
                    .catch(err => { throw err });
            } else {
                managerId = '';
            }
            
            // update role for employee
            myDb.queryDb(`UPDATE employee SET role_id = ${roleId}, manager_id = ${managerId} WHERE (id = ${employeeId})`)
                .then(() => {
                    console.log(`\n ${first_name} ${last_name} job title was successfully updated. \n`);
                })      
                .then(() => { init() })
                .catch(err => { throw err });
        });
};

init();

// Update employee managers. check

// View employees by manager. check

// View employees by department. check

// Delete departments, roles, and employees.

// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.