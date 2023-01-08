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
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'View All Managers', 'View Employees by Department', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update Employee', 'Delete Department', 'Delete Role', 'Delete Employee', 'View Budget', 'Exit'];
let selectDepts, selectRoles, selectEmployee, selectManager;
let deptList = [];
let roleList = [];
let employeeList = [];
let managerList = [];

// start here
const init = async () => {
    // updates arrays
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
                getManagers();
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
            case 'Update Employee':
                updateEmployee();
                break;
            case 'Delete Department':
                deleteDept();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'View Budget':
                viewBudget();
                break;
            case 'Exit':
                myDb.end();
                break;         
        }
    });
};

const getDept = async (display, menuRequest) => {      

    // myDb class, queryDb method
    await myDb.queryDb(`SELECT d.id, d.dept_name AS department FROM department d ORDER BY d.id ASC`)
        .then(results => { 
            // only show table when desired
            if (display) { console.log('\n'); console.table(results); }

            selectDepts = results;
        })
        .then(() => { if (menuRequest) menu() })
        .catch(err => { throw err });      
};

const getRole = async (display, menuRequest) => {

    await myDb.queryDb(`SELECT r.id, r.title, d.dept_name AS department, r.salary FROM role r INNER JOIN department d ON r.department_id = d.id ORDER BY r.id ASC`)
        .then(results => { 
            // only show table when desired
            if (display) { console.log('\n'); console.table(results); } 

            selectRoles = results;
        })
        .then(() => { if (menuRequest) menu() })
        .catch(err => { throw err });
};

const getEmployee = async (display, menuRequest) => {

    let employeeQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.last_name ASC`;

    // myDb class, queryDb method
    await myDb.queryDb(employeeQuery)
        .then(results => { 
            // only show table when desired
            if (display) { console.log('\n'); console.table(results); } 

            // populate arrays
            selectEmployee = results;
        })
        .then(() => { if (menuRequest) menu() })
        .catch(err => { throw err });
};

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
        .then(async answer => {
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
            FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id WHERE (e.manager_id = ${managerId})`;

            // myDb class, queryDb method
            await myDb.queryDb(employeeQuery)
                .then(results => { 
                    console.log('\n');
                    console.table(results); 

                    // prevent repop
                    managerList = [];
                })
                .catch(err => { throw err });            
        })
        .then(() => { menu() });
};

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
        .then(async answer => {
            // get id of name that matches
            
            // get manager id
            await myDb.queryDb(`SELECT id FROM department WHERE (dept_name = '${answer.dept_name}')`)
                .then(results => {
                    deptId = results[0].id;
                })
                .catch(err => { throw err });

            let employeeQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager 
            FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id WHERE (d.id = ${deptId})`;

            // myDb class, queryDb method
            await myDb.queryDb(employeeQuery)
                .then(results => { 
                    console.log('\n');
                    console.table(results);

                    deptList = [];
                })
                .catch(err => { throw err });            
        })
        .then(() => { menu() });
};

const addDepartment = () => {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept_name',
                message: 'What is the name of the department?'
            }
        ])
        .then(async answer => {
            // check if entry already exist
            await myDb.queryDb(`SELECT dept_name FROM department WHERE EXISTS (SELECT * FROM department WHERE (dept_name = '${answer.dept_name}'))`)
                .then(async results => {
                    
                if (results.length > 0) {
                    console.log('\n Department already exist in database. \n');
                } else { 
                    await myDb.queryDb(`INSERT INTO department(dept_name) VALUES ('${answer.dept_name}')`)
                        .then(() => {
                            console.log(`
${answer.dept_name} was successfully added to Departments.
`);
                        })
                        .catch(err => { throw err })
                }
            })           
            .then(() => { getDept() })
            .catch(err => { throw err });
        })
        .then(() => { menu() });   
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
        .then(async answers => {
            // get department id
            await myDb.queryDb(`SELECT id FROM department WHERE (dept_name = '${answers.role_dept}')`)
                .then(results => {
                    departmentId = results[0].id;
                })
                .catch(err => { throw err });

            // check if role name already exist
            await myDb.queryDb(`SELECT title FROM role WHERE EXISTS (SELECT * FROM role WHERE (title = '${answers.title}'))`)
                .then(async results => {
                    if (results.length > 0) {
                        console.log('\n Role already exist in database. \n');
                    } else { 
                        await myDb.queryDb(`INSERT INTO role(title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${departmentId})`)
                            .then(() => {
                                console.log(`
${answers.title} was successfully added to Roles.
`);
                            })
                            .catch(err => { throw err });
                    }
                })    
                .then(() => { getRole() })    
                .catch(err => { throw err });
        })   
        .then(() => { menu() });           
};

const addEmployee = () => {
    employeeList = [];

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

    employeeList.unshift('None');    

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
        .then(async answers => {

            //get role id
            await myDb.queryDb(`SELECT id FROM role WHERE (title = '${answers.role}')`)
                .then(results => {
                    roleId = results[0].id;
                })
                .catch(err => { throw err });

            if (answers.manager === 'None') {
                // null value
                managerId = 'NULL';
            } else {
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
            }

            // check if employee already exist
            await myDb.queryDb(`SELECT id FROM employee WHERE EXISTS (SELECT * FROM employee WHERE (first_name = '${answers.fname}' AND last_name = '${answers.lname}'))`)
                .then(async results => {
                    if (results.length > 0) {
                        console.log('\n Employee already exist in database. \n');
                    } else { 
                        await myDb.queryDb(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.fname}', '${answers.lname}', ${roleId}, ${managerId})`)
                            .then(() => {
                                console.log(`
${answers.fname} ${answers.lname} was added to Employees.
`);
                            })
                            .catch(err => { throw err });
                    }
                })        
            .then(() => { getEmployee() })
            .catch(err => { throw err });
        })  
        .then(() => { menu() });   
};

const updateEmployee = () => {
    employeeList = [];

    let employeeName, employeeId, roleId, managerId, first_name, last_name;

    // concat first and last names to build employeeList
    selectEmployee.forEach((i) => {
        employeeName = `${i.first_name} ${i.last_name}`;
        employeeList.push(employeeName);    
    });

    // add none to employee list
    managerList = ['None', ...employeeList];

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
        .then(async answers => {
            
            // get id of name that matches
            const name = [answers.employee];
            const temp = name[0].split(' '); 
                
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
            
            if (answers.manager === 'None') { 
                managerId = 'NULL';
            } else {
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
            }
            
            // update role and manager for employee
            await myDb.queryDb(`UPDATE employee SET role_id = ${roleId}, manager_id = ${managerId} WHERE (id = ${employeeId})`)
                .then(() => {
                    console.log(`
${answers.employee} job title was successfully updated.
`);
                })      
                .then(() => { getEmployee() })
                .catch(err => { throw err });
        })
        .then(() => { menu() });
};

const deleteDept = () => {
    let departmentId;

    //populate array
    selectDepts.forEach((i) => {
        deptList.push(i.department);               
    });

    const deleteDeptQuestions = [
        {
            type: 'list',
            name: 'department',
            message: 'Which department would you like to delete?',
            choices: deptList,
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to delete this department?'
        },
    ];
    
    inquirer
        .prompt(deleteDeptQuestions)
        .then(async answers => {

            if (answers.confirm) {
                // get department id
                await myDb.queryDb(`SELECT id FROM department WHERE (dept_name = '${answers.department}')`)
                    .then(results => {
                        departmentId = results[0].id;
                    })
                    .catch(err => { throw err });

                // does department have employees?
                await myDb.queryDb(`SELECT d.id, COUNT(e.id) FROM department d INNER JOIN role r ON d.id = r.department_id INNER JOIN employee e ON r.id = e.role_id WHERE d.id = ${departmentId}`)
                    .then(async results => {
                        if (results.length > 0) {
                            console.log(`
Please reassign employee(s) and role(s) before deleting ${answers.department}.
`);
                        } else {
                            // delete department by id
                            await myDb.queryDb(`DELETE FROM department WHERE (id = ${departmentId})`)
                                .then(() => {
                                    console.log(`
${answers.department} has been deleted.
`);
                                })  
                                .catch(err => { throw err });
                        }
                    })
                    .then(() => { getDept() })
                    .catch(err => { throw err });
            }      
        })
        .then(() => { menu() });   
};

const deleteRole = () => {
    roleList = [];

    let roleId;

    //populate array
    selectRoles.forEach((i) => {
        roleList.push(i.title);               
    });

    const deleteRoleQuestions = [
        {
            type: 'list',
            name: 'title',
            message: 'Which role would you like to delete?',
            choices: roleList,
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to delete this role?'
        },
    ];
    
    inquirer
        .prompt(deleteRoleQuestions)
        .then(async answers => {

            if (answers.confirm) {
                // get role id
                await myDb.queryDb(`SELECT id FROM role WHERE (title = '${answers.title}')`)
                    .then(results => {
                        roleId = results[0].id;
                    })
                    .catch(err => { throw err });

                // does role have employees?
                await myDb.queryDb(`SELECT id FROM employee WHERE EXISTS (SELECT * FROM employee WHERE (role_id = '${roleId}'))`)
                    .then(async results => {
                        if (results.length > 0) {
                            console.log(`
Please reassign employee(s) to another position before deleting ${answers.title}.
`);
                        } else { 
                            // delete role by id
                            await myDb.queryDb(`DELETE FROM role WHERE (id = ${roleId})`)
                                .then(() => {
                                    console.log(`
${answers.title} has been deleted.
`);
                                })  
                                .catch(err => { throw err });
                        }
                    })
                    .then(() => { getRole() })
                    .catch(err => { throw err });
            }      
        })
        .then(() => { menu() });   
};

const deleteEmployee = () => {

    let employeeName, employeeId, first_name, last_name;

    // concat first and last names to build employeeList
    selectEmployee.forEach((i) => {
        employeeName = `${i.first_name} ${i.last_name}`;
        employeeList.push(employeeName); 
    });

    const deleteEmployeeQuestions = [
        {
            type: 'list',
            name: 'full_name',
            message: 'Which employee would you like to remove?',
            choices: employeeList,
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to remove this employee?'
        },
    ];
    
    inquirer
        .prompt(deleteEmployeeQuestions)
        .then(async answers => {

            let name = [answers.full_name];

            let temp = name[0].split(' '); 
            
            first_name = temp[0];
            last_name = temp[1];                

            if (answers.confirm) {
                // get employee id
                await myDb.queryDb(`SELECT id FROM employee WHERE (first_name = '${first_name}' AND last_name = '${last_name}')`)
                    .then(results => {
                        employeeId = results[0].id;
                    })
                    .catch(err => { throw err });

                // is employee manager?
                await myDb.queryDb(`SELECT id FROM employee WHERE EXISTS (SELECT * FROM employee WHERE (manager_id = '${employeeId}'))`)
                    .then(async results => {
                        if (results.length > 0) {
                            console.log(`
Please reassign team member(s) to another manager before removing ${answers.full_name}.
`);
                        } else { 
                            // delete employee by id
                            await myDb.queryDb(`DELETE FROM employee WHERE (id = ${employeeId})`)
                                .then(() => {
                                    console.log(`
${answers.full_name} has been removed.
`);
                                })
                                .catch(err => { throw err });
                        }
                    })  
                    .then(() => { getEmployee() })
                    .catch(err => { throw err });                    
            }      
        })
        .then(() => { menu() }); 
};

const viewBudget = async () => {

    let roleQuery = `SELECT d.dept_name AS department, SUM(r.salary) AS total_salary FROM role r INNER JOIN department d ON d.id = r.department_id 
    INNER JOIN employee e ON e.role_id = r.id GROUP BY d.dept_name ORDER BY d.id`;

    await myDb.queryDb(roleQuery)
            .then(results => { 
                console.log('\n');
                console.table(results);
            })
            .then(() => { menu() })
            .catch(err => { throw err });  
};

init();