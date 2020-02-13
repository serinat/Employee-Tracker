USE employee_tracker_db;

INSERT INTO department (name)
VALUES ("Engineering"), ("Sales"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES
("Software Engineer", 100000, 1),
("Aeronautical Engineer", 200000, 1),
("Sales Manager", 80000, 2),
("Salesperson", 60000, 2),
("Accountant", 90000, 3),
("Fiscal Specialist", 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Harry", "Furusho", 1, 1),
("Norman", "Lei", 1, 2),
("Lily", "Chon", 2, 5),
("Jasmine", "Wang", 3, 2),
("Arnold", "Diep", 2, 5),
("Chris", "Barcala", 3, 1);