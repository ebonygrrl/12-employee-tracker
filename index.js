// database connection
const myDb = require('./utils/connection');

// get classes
const dbQuery = require('./lib/query-db');
const modifyDb = require('./lib/modify-db');

// app modules
const inquirer = require('inquirer');

// reserve variable for queries
let connect;

// inquirer choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role', 'Exit'];
//const initOptions = ['Add a Department', 'Exit'];
const selectDepts = ['Engineering', 'Finance', 'Legal', 'Sales'];
const selectRoles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer'];
const selectEmployee = [];

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
        name: 'role_name',
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


const init = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: initOptions,
    }]).then(answer => {   

        switch(answer.start) {
            case 'View All Departments':
                getDepts();
                setTimeout(() => {init()},1000);
                break;
            case 'View All Roles':
                getRoles();
                setTimeout(() => {init()},1000);
                break;
            case 'View All Employees':
                connect = new dbQuery('SELECT * FROM employee');
                connect.queryDb();
                setTimeout(() => {init()},1000);
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

const getDepts = () => {
    connect = new dbQuery('SELECT * FROM department');
    connect.queryDb();
}

const getRoles = () => {    
    connect = new dbQuery('SELECT * FROM role');
    connect.queryDb();
}

const getStaff = () => {
    connect = new dbQuery('SELECT * FROM employee');
    connect.queryDb();
}

const addDepartment = () => {
    inquirer
        .prompt(addDepartmentQuestion)
        .then(answer => {
            // check if department name already exist
            connect = new modifyDb(`SELECT dept_name FROM department WHERE EXISTS (SELECT * FROM department WHERE dept_name = '${answer.dept_name}')`);
            connect.addDept(answer.dept_name);
            // get updated table
            connect = new dbQuery('SELECT * FROM department');
            
            setTimeout(() => {init()},1000);
            // update department array
            let data = connect.queryDbArr();
            selectDepts.push(data)
            console.log(`this is the data \r\r ${selectDepts}`);
        });   
};

const addRole = () => {
    inquirer
        .prompt(addRoleQuestions)
        .then(answers => {
            //let responses = [answers.role_name, answers.salary, answers.role_dept];
            // check if department name already exist
            connect = new modifyDb(`SELECT EXISTS (SELECT title FROM role WHERE title = '${answers.role_name}')`);
            connect.addRole(answers.role_name, answers.salary, answers.role_dept);
            setTimeout(() => {init()},1000);
        });   
};

const addEmployee = () => {};

const updateEmployee = () => {};

init();