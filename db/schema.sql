/* create database name */
DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

/* create department table */
CREATE TABLE department 
(
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

/* create role table */
CREATE TABLE role 
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) 
        REFERENCES department(id)
        ON DELETE SET NULL
);

/* create employee table*/
CREATE TABLE employee 
(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) 
        REFERENCES role(id),
    FOREIGN KEY (manager_id) 
        REFERENCES employee(id)
        ON DELETE SET NULL
);