// app modules
const inquirer = require('inquirer');

const getDepartments = require('./utils/mysql');

// start menu choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role'];
const selectRoles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer'];

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
                getDepartments();
                break;
        }
    });  




// all departments
// Engineering, Finance, Legal, Sales

// all roles
// Sales Lead, Salesperson, Lead Engineer, Software Engineer, Account Manager, Accountant, Legal Team Lead, Lawyer

// add department: Service
// add role: Customer Service