const mysql = require("mysql");
const inquirer = require("inquirer");
//require("console.table");
//const sql = require("./sql");

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
              selectRemoveEmployee();
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
                message: "Please select department to view.",
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


function selectRemoveEmployee() {
  connection.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    inquirer
        .prompt({
            name: "removeEmployee",
            type: "list",
            message: "Please select employee to remove",
            choices: function () {
                var employeeArray = [];
                for (var i = 0; i < results.length; i++) {
                    employeeArray.push(results[i].first_name);
                }
                return employeeArray;
            }
        })
        .then(function (employee) {
            removeEmployee(employee);
        })
})

}


function removeEmployee(employee) {
  connection.query("DELETE * From employees where first_name='John'", function (err, results) {
      if (err) throw err;
      start();
  })

}
function updateEmployeeRole() {
  connection.query("UPDATE FROM employees", function (err, results) {
      if (err) throw err;
      inquirer
          .prompt({
              name: "employeeRole",
              type: "list",
              message: "Please select employee whose role you would like to update",
              choices: function () {
                  var employeeArray = [];
                  for (var i = 0; i < results.length; i++) {
                      employeeArray.push(results[i].employeeFirstName);
                  }
                  return employeeArray;
              }
          })
  })

}