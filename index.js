const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
const { nextTick } = require("process");
const seed = require("seed");

// create the connection information for the sql database

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "blessed2021$",
  database: "employees",
});

//Connect to MySQL
connection.connect((err) => {
  if (err) throw err;

  connection.query = util.promisify(connection.query);
  mergeWithDB();

  //console.table(result)
  //mergerwithDB();
});
async function availableDepartments() {
  let sql = "Select * FROM department";
  const departments = await connection.query(sql);

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  return departmentChoices;
}

async function availableRole() {
  let sql = "SELECT * FROM role";
  const roles = await connection.query(sql);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log({ roleChoices });
  return roleChoices;

  //console.table(result)
  //mergerwithDB();
}

async function availableEmployees() {
  let sql = "SELECT * FROM employee";
  const employees = await connection.query(sql);

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  return employeeChoices;
}

async function availableManagers() {
  let sql = "SELECT * FROM employee WHERE isManager='1'";
  const managers = await connection.query(sql);

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  return managerChoices;
}

function mergeWithDB() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["Add", "View", "Update", "Delete", "Exit"],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add":
          add();
          break;

        case "View":
          view();
          break;

        case "Update":
          update();
          break;

        case "Delete":
          toDelete();
          break;

        case "Exit":
          process.exit();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
}
//Define general add department, role and employee function
function add() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to add?",
      choices: ["Department", "Role", "Employee"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Department":
          addDepartment();
          break;

        case "Role":
          addRole();
          break;

        case "Employee":
          addEmployee();
          break;
      }
    });
  //Define addDepartment function
  function addDepartment() {
    inquirer
      .prompt({
        name: "action",
        type: "input",
        message: "What the name of the department?",
      })
      .then(function (answer) {
        const sql = "INSERT INTO department (name) VALUES(?)";
        connection.query(sql, answer.action, function (err, res) {
          if (err) throw err;
          console.log("Department added! Next...");
          mergeWithDB();
        });
      });
  }
}

//Define addRole function

function addRole() {
  const myChoices = [];
  const departmentIdName = {};

  availableDepartments();

  const questions = [
    {
      name: "title",
      type: "input",
      message: "What is the job title/position?",
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary for this title/position?",
    },
    {
      name: "departmentID",
      type: "rawlist",
      message: "Please select the department for this role?",
      choices: myChoices,
    },
  ];
  //function to provide departments as choices and reference it ID to the role
  function availableDepartments() {
    let sql = "SELECT * FROM department";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        myChoices.push(result[i].name);
        departmentIdName[result[i].name] = result[i].id;
      }
    });
  }

  //send data
  inquirer.prompt(questions).then(function (answer) {
    connection.query(
      "INSERT INTO role (title, salary, department_id) Values(?,?,?)",
      [answer.title, answer.salary, departmentIdName[answer.departmentID]],
      function (err, result) {
        if (err) throw err;
        console.log("Role added! Next...");
        mergeWithDB();
      }
    );
  });
}

//Define addEmployee function
async function addEmployee() {
  const roleIDTitle = {};
  const managerId = {};

  const myRoleChoices = await availableRole();
  const myManagerChoices = await availableManagers();

  const questions = [
    {
      name: "firstName",
      type: "input",
      message: "What the employee's first name?",
    },
    {
      name: "lastName",
      type: "input",
      message: "What the employee's last name?",
    },
    {
      name: "roleID",
      type: "rawlist",
      message: "Please select the role/position for this employee?",
      choices: myRoleChoices.map((role) => role.value),
    },

    {
      name: "manager",
      type: "confirm",
      message: "Is this manager/superviser of this employee?",
    },

    {
      name: "managerId",
      type: "rawlist",
      message: "Please select the manager/supervise of this employee?",
      choices: myManagerChoices.map((manager) => manager.name),
    },
  ];

  /*function availableRole() {
    let sql = "SELECT * FROM role";
    connection.query(sql, async function (err, result) {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        myRoleChoices.push(result[i].title);
        roleIDTitle[result[i].title] = result[i].id;
      }
      //return myRoleChoices;
    });
  }

  function availableManager() {
    let sql = "SELECT * FROM employee WHERE isManager=1";

    connection.query(sql, async function (err, result) {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        myManagerChoices.push(`${result[i].first_name} ${result[i].last_name}`);
        managerId[result[i].first_name] = result[i].id;
        managerId[result[i].last_name] = result[i].id;
      }
      return myManagerChoices;
    });
  }*/

  const answer = await inquirer.prompt(questions);

  const role = myRoleChoices.find((role) => role.title === answer.roleID);
  const manager = myManagerChoices.find(
    (manager) => manager.name === answer.managerID
  );
  console.log(role, manager);
  const res = await connection.query(
    "INSERT INTO employee (first_name, last_name, role_id, isManager, superviserORmanager_id)VALUES (?,?,?,?,?)",
    [
      answer.firstName,
      answer.lastName,
      //answer.roleIdTitle,
      role.value,
      answer.manager,
      //answer.managerId,
      manager.value,
    ]
  );
  console.log(
    `${answer.firstName} ${answer.lastName} was added as an employee. Next...`
  );
  mergeWithDB();
}

//Define general View departments, roles, employees
function view() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to view?",
      choices: ["Departments", "Roles", "Employees"],
    })

    .then(function (answer) {
      switch (answer.action) {
        case "Departments":
          availableDepartments();
          break;

        case "Roles":
          availableRole();
          break;

        case "Employees":
          availableEmployees();
          break;
      }
    });
}
function availableDepartments() {
  let sql = "SELECT * FROM department";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      console.log(result[i].name);
    }
    mergeWithDB();
  });
}
function availableRole() {
  const sql = "SELECT * FROM role";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      console.log(result[i].title);
      mergeWithDB();
    }
  });
}
function availableEmployees() {
  let sql = "SELECT * FROM employee";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      console.log(`${result[i].first_name} ${result[i].last_name}`);
      mergeWithDB();
    }
  });
}

//Define general Update employee's role
function update() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to update",
      choices: ["Employee's Role", "Employee's Manager"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Employee's Role":
          updateEmployeesRole();
          break;

        case "Employee's Manager":
          updateEmployeesManager();
          break;
      }
    });
}
async function updateEmployeesRole() {
  let Choices = [];
  let myRoleChoices = [];

  myRoleChoices = await availableRole();
  Choices = await availableEmployees();

  const answer = await inquirer.prompt([
    {
      name: "action",
      type: "rawlist",
      message: "Which employee would you like to update",
      choices: ["Tierra Rogers", "Chris Bo", "Zambia Rogers"],
    },
    {
      name: "newRole",
      type: "rawlist",
      message: "What's the employee's new role",
      choices: ["Software Engineer", "Sales", "HR"],
    },
  ]);
  connection.query(
    "UPDATE employee SET role_id= ''?'' 'WHERE id=`'?'`' ",
    [answer.newRole, answer.action],
    function (err, result) {
      if (err) throw err;
      console.log("updated! next.");
      mergeWithDB();
    }
  );
}

async function updateEmployeesManager() {
  let Choices = [];
  let myManagerChoices = [];

  myManagerChoices = await availableManagers();
  Choices = await availableEmployees();

  const answer = await inquirer.prompt([
    {
      name: "action",
      type: "rawlist",
      message: "Which employee would you like to update",
      choices: Choices,
    },
    {
      name: "newManager",
      type: "rawlist",
      message: "What's the employee's new manager",
      choices: myManagerChoices,
    },
  ]);
  connection.query(
    "UPDATE employee SET superviserORmanager_id='?'  WHERE id='?'",
    [answer.newManager, answer.action],
    function (err, result) {
      if (err) throw err;
      console.log("updated! next.");
      mergeWithDB();
    }
  );
}

function toDelete() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      messagae: "What would you like to delete?",
      choices: ["Departments", "Roles", "Employees"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Departments":
          deleteDepartments();
          break;
        case "Roles":
          deleteRoles();
          break;
        case "Employees":
          deleteEmployees();
          break;
      }
    });
  async function deleteDepartments() {
    const listOfDepartments = [];

    listOfDepartments = await availableDepartments();

    await inquirer
      .prompt({
        name: "action",
        type: "rawist",
        message: "Which department would like to delete",
        choices: listOfDepartments,
      })
      .then(function (answer) {
        connection.query(
          "Delete FROM department WHERE id='?'",
          answer.action,
          function (err, result) {
            if (err) throw err;
            console.log("deleted! next...");
            mergeWithDB();
          }
        );
      });
  }
  async function deleteRoles() {
    let myRoleChoices = [];

    myRoleChoices = await availableRole();

    await inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "Which role would you like to delete",
        choices: myRoleChoices,
      })
      .then(function (answer) {
        connection.query(
          "Delete FROM role WHERE id='?'",
          answer.action,
          function (err, result) {
            if (err) throw err;
            console.log("deleted! next...");
            mergeWithDB();
          }
        );
      });
  }
  async function deleteEmployees() {
    let Choices = [];

    Choices = await availableEmployees();

    await inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "Which employee would you like to delete",
        choices: Choices,
      })
      .then(function (answer) {
        connection.query(
          "Delete FROM employee WHERE id='?'",
          answer.action,
          function (err, result) {
            if (err) throw err;
            console.log("deleted! next...");
            mergeWithDB();
          }
        );
      });
  }
}
module.exports;
