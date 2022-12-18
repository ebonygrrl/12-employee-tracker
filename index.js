// app modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

// start menu choices
const initOptions = ['View All Departments', 'View All Roles', 'View All Employees', new inquirer.Separator(), 'Add a Department', 'Add a Role', 'Add An Employee', new inquirer.Separator(), 'Update An Employee Role']

inquirer
    .prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: initOptions,
        }])
    .then(answers => { 
        const staff = new Manager(answers.fname, answers.id, answers.email, answers.office);

        //add responses to empty array
        output.push(staff);

        //build rest of team
        employeePrompt();
    });  




// all departments
// Engineering, Finance, Legal, Sales

// all roles
// Sales Lead, Salesperson, Lead Engineer, Software Engineer, Account Manager, Accountant, Legal Team Lead, Lawyer

// add department: Service
// add role: Customer Service