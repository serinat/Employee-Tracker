DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE employee (
    ID int NOT NULL PRIMARY KEY,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id int NOT NULL,
    manager_id int
);

CREATE TABLE employee_role (
    ID int NOT NULL PRIMARY KEY,
    title varchar(30) NOT NULL,
    salary decimal NOT NULL,
    department_id int NOT NULL
);

CREATE TABLE department (
    ID int NOT NULL PRIMARY KEY,
    dept_name varchar(30) NOT NULL,
);

