const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
// const sql = require("./sql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "SQL@8mahal",
  database: "employeesDB"
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});

function start() {

  inquirer
    .prompt({
      type: "list",
      name: "Action",
      message: "Please select from the following",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "End"]
    })
    .then(function (answer) {
      if (answer.Action === "View All Employees") {
        viewAllEmployees();
      } else
        if (answer.Action === "View All Employees by Department") {
          viewEmployeeByDepartment();
        } else
          if (answer.Action === "Add Employee") {
            addEmployee();
          } else
            if (answer.Action === "Remove Employee") {
              removeEmployee();
            } else
              if (answer.Action === "Update Employee Role") {
                updateEmployeeRole();
              } else
                if (answer.Action === "End") {
                  connection.end();
                }


    })
}


//View All Employees

function viewAllEmployees() {
  var query = "SELECT * FROM employees";
    connection.query(query, function (err, results) {
        if (err) throw (err);
        console.table(results)
        start();
    })

}

//View All Employees by Department

function viewEmployeeByDepartment() {
  var query = "select * from employees inner join role on employees.role_id=role.role_id WHERE employees.role_id = 1";
    connection.query(query, function (err, results) {
        if (err) throw (err);

        inquirer
            .prompt({
                name: "selectDepartment",
                type: "list",
                message: "Select which department you would like to view.",
                choices: ["Sales", "Engineering", "Management"]

            })
            .then(function (results) {
                console.table(results)
                start();
            })

    })
}

function addEmployee() {
  inquirer
        .prompt([
            {
                name: "employeeFirstName",
                type: "input",
                message: "Please enter employee's first name"
            },
            {
                name: "employeeLastName",
                type: "input",
                message: "Please enter employee's last name"
            },
            {
                name: "employeeRole",
                type: "list",
                message: "Please enter employee's position",
                choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Manager"]
            },
            {
            name: "roleID",
            type: "input",
            message: "Please enter role ID"
            },

            {
                name: "managerID",
                type: "input",
                message: "Please enter manager ID"
            }
        ])
        .then(function (employee) {
            connection.query("SELECT * FROM role", function (err, results) {
                employeeFirstName = employee.employeeFirstName;
                employeeLastName = employee.employeeLastName;
                employeeRole = employee.employeeRole;
                roleID = employee.roleID;
                managerID = employee.managerID

            })
            insertEmployee(employee);
            start();
        })


}

function insertEmployee(employee) {
    connection.query(
        "INSERT INTO employees SET ?",
        {
            first_name: employee.employeeFirstName,
            last_name: employee.employeeLastName,
            role: employee.employeeRole,
            role_id: employee.roleID,
            manager_id: employee.managerID,
        })

}


function removeEmployee() {
  console.log("Deleting an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete\n");

    promptDelete(deleteEmployeeChoices);
  });
}


function promptDelete(deleteEmployeeChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Please choose employee to remove?",
        choices: deleteEmployeeChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM employee WHERE ?`;
      connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted\n");

        firstPrompt();
      });
    });
}


function updateEmployeeRole() {
  employeeArray();

}

function employeeArray() {
  console.log("Updating an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("Employees to update\n")

    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("Updating a role");

  var query =
    `SELECT r.id, r.title, r.salary 
  FROM role r`
  let roleChoices;

  connection.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("Role to Update\n")

    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Choose employee to set with the role?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "Please choose role to update",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      var query = `UPDATE employee SET role_id = ? WHERE id = ?`
      connection.query(query,
        [answer.roleId,
        answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully");

          firstPrompt();
        });
    });
}



function addRole() {

  var query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    console.table(res);
    console.log("Department array");

    promptAddRole(departmentChoices);
  });
}

function promptAddRole(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Role title?"
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Role Salary"
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: departmentChoices
      },
    ])
    .then(function (answer) {

      var query = `INSERT INTO role SET ?`

      connection.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.departmentId
      },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Role Inserted");

          firstPrompt();
        });

    });
}
