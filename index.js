// get class
const Queries = require('./lib/queries');

// app modules
const inquirer = require('inquirer');

//import mysql queries
//const { getDepartments, getRoles, getEmployees } = require('./utils/mysql');



// start menu choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add An Employee', 'Update An Employee Role'];
const selectRoles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer'];
const employees = [];


const init = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: initOptions,
        }])
        .then(answer => {
        
        switch(answer.start) {
            case 'View All Departments':
                const query = new Queries(answer.start);
                //console.log(query);
                query.getDepartments();
                break;
            case 'View All Roles':
                getRoles();
                break;
            case 'View All Employees':
                getEmployees();
                break;
            case 'Add a Department':
                break;
            case 'Add a Role':
                break;
            case 'Add An Employee':
                break;
            case 'Update An Employee Role':
                break;            
        }
    });  
}

init();