# 12 Employee Tracker

## Table of Contents
1. [Description](#desc)
2. [Installation](#install)
3. [Usage](#usage)
4. [Demo](#demo)
5. [License](#license)

<a name="desc"></a>
## Description 
Build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

<a name="install"></a> 
## Installation

1. After cloning this repo, install Node dependencies by entering `npm i` into your terminal.
2. Update database credentials by entering your MySQL password located utils > connection.js.
3. Install the database by sourcing the schema located db > schema.sql.
4. Seed the database with the data provided located db > seeds.sql.
5. Initiate app by entering `node index.js` or `node .` into your terminal.

<a name="usage"></a> 
## Usage
Once the application begins, choose an option from the main menu by using the up and down arrows and pressing enter.

* View All Departments
* View All Roles
* View All Employees
* View All Managers
* View Employees by Department
* Add a Department
* Add a Role
* Add An Employee
* Update Employee
* Delete Department
* Delete Role
* Delete Employee
* View Budget
* Exit

<a name="demo"></a> 
## Demo
Here's a [video](https://youtu.be/nFIlcVQHYB8) of the application in use.

[![Video thumbnail](./public/img/youtube-screenshot.jpg)](https://youtu.be/nFIlcVQHYB8)

A few screenshots of this application in action.

[![Main Menu](./public/img/main-menu.jpg)]

[![Main Menu](./public/img/view-budget.jpg)]

Working through the View Budget query.

[![MySQL Workbench]](./public/img/sql-query.jpg)]

<a name="license"></a> 
## License
All code is released under the [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.en.html).