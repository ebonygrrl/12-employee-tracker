/* create database name */;
DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

/* create department table */;
CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT,
  dept_name varchar(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id)
);

/* create role table */;
CREATE TABLE role (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(30),
  salary decimal(10,0),
  department_id int NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  FOREIGN KEY (department_id),
  REFERENCES department (id)
);

/* create employee table*/;
CREATE TABLE employee (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(30),
  last_name varchar(30),
  role_id int NOT NULL,
  manager_id int NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  FOREIGN KEY (manager_id),
  REFERENCES employee (id)
  FOREIGN KEY (role_id),
  REFERENCES role (id)
);