// database connection
const myDbConfig = require('./utils/connection');

// get classes
const dbQuery = require('./lib/query');
const Department = require('./lib/department-query');
const Role = require('./lib/role-query');

// wire db connection to query class
let myDb = new dbQuery(myDbConfig);

// app modules
const inquirer = require('inquirer');
const cTable = require('console.table');

// reserve variable for queries
let connect;

// inquirer choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role', 'Exit'];
//const initOptions = ['Add a Department', 'Exit'];
//const selectDepts = ['Engineering', 'Finance', 'Legal', 'Sales'];
let selectDepts = [];
let selectRoles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer'];
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
    // get db fields
    getViews('department');
    getViews('role');
    getViews('employee');

    // main menu
    inquirer.prompt([{
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: initOptions,
    }]).then(answer => {   

        switch(answer.start) {
            case 'View All Departments':
                getViews('department', true);
                break;
            case 'View All Roles':
                getViews('role', true);
                break;
            case 'View All Employees':
                getViews('employee', true);
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add An Employee':
                // connect = new dbQuery('INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ('NULL', ${this.fname}, ${this.lname}, ${this.role}, ${this.manager});');
                // connect.addEmployee();
                // function
                break;
            case 'Update An Employee Role':
                // connect = new dbQuery('UPDATE employee SET address = 'Canyon 123' WHERE address = 'Valley 345'');
                // connect.updateEmployee();
                // function 
                break;
            case 'Exit':
                myDb.end();
                break;         
        }
    });
}

const getViews = (table, display) => {
    
    myDb.queryDb(`SELECT * FROM ${table}`)
        .then(results => { 
            // only show table when desired
            if (display) console.table(results); 

            // populate arrays
            switch(table) {
                case 'department':
                    selectDepts = [];
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
        
    //connect = new dbQuery(`SELECT * FROM ${table}`);
    //connect.queryDb();

    setTimeout(() => {init()}, 1000);
}

const addDepartment = () => {
    inquirer
        .prompt(addDepartmentQuestion)
        .then(answer => {
            // check if department name already exist
            connect = new Department(`SELECT dept_name FROM department WHERE EXISTS (SELECT * FROM department WHERE dept_name = '${answer.dept_name}')`);
            connect.addDept(answer.dept_name);
            
            setTimeout(() => {
                getViews('department');
                init()
            }, 1000);
        });   
};

const addRole = () => {
    getViews('department');
    console.log(selectDepts);
    inquirer
        .prompt(addRoleQuestions)
        .then(answers => {
            console.log(answers.role_dept);
            // check if role name already exist
            //connect = new Role(`SELECT title FROM role WHERE EXISTS (SELECT * FROM role WHERE title = '${answers.role_name}')`);
            //connect.addRole(answers.role_name, answers.salary, answers.role_dept);
            //console.log(answers.role_dept);
            setTimeout(() => {
                getViews('role');
                init()
            }, 1000);
        });   
};

const addEmployee = () => {};

const updateEmployee = () => {};

init();