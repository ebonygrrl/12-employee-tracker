INSERT INTO department (id, dept_name)
VALUES (1,'Engineering'),
       (2,'Finance'),
       (3,'Legal'),
       (4,'Sales');

INSERT INTO role (id, title, salary, department_id) 
VALUES (1,'Sales Lead',60000,4),
       (2,'Salesperson',40000,3),
       (3,'Lead Engineer',120000,1),
       (4,'Software Engineer',90000,3),
       (5,'Account Manager',62000,3),
       (6,'Accounting',55000,3),
       (7,'Legal Team Lead',70000,3),
       (8,'Lawyer',68000,3);

INSERT INTO employee (id, first_name, last_name, role_id) 
VALUES (1,'Renee','Aguirre',2),
       (2,'George','Cook',8),
       (3,'Derek','Hess',6),
       (4,'Amber','Dunn',4),
       (5,'Kayla','Brown',1);