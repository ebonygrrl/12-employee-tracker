// get class
const dbQuery = require('./lib/queries');

// app modules
const inquirer = require('inquirer');

// inquirer choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role'];
const selectRoles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer'];

// inquirer questions
const addDepartmentQuestion = [
    {
        type: 'input',
        name: 'dept_name',
        message: 'What is the name of the department?'
    }
];

const addRoleQuestions = [

];

const addEmployeeQuesions = [

];

const updateRoleQuestions = [

];


const init = () => {
    let connect;

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'start',
                message: 'What would you like to do?',
                choices: initOptions,
            }])
        .then(answer => {        
            switch(answer.start) {
                case 'View All Departments':
                    connect = new dbQuery('SELECT * FROM department');
                    connect.getDepartments();
                    break;
                case 'View All Roles':
                    connect = new dbQuery('SELECT * FROM role');
                    connect.getRoles();
                    break;
                case 'View All Employees':
                    connect = new dbQuery('SELECT * FROM employee');
                    connect.getEmployees();
                    break;
                case 'Add a Department':
                    // function
                    break;
                case 'Add a Role':
                    // function
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
        }
    });  
}

const addDepartment = () => {};

const addRole = () => {};

const addEmployee = () => {};

const updateEmployee = () => {};

init();