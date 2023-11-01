const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: '1350Southh90!',
    database: 'employee_db'
});
const PORT = 3001

connection.connect(err => {
    if (err) throw (err);
});

const userOptions = () =>{
    inquirer.prompt([
        {
            type: 'list',
            name: 'Options',
            message: 'Please make a selection.',
            choices: ['view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role',
        ]
        }
    ])
    .then((responses) => {
        const { choices } = responses;
        if (choices === 'view all departments'){
            queryDepartments();
        }
        if (choices === 'view all roles'){
            queryRoles();
        }
        if (choices === 'view all employees'){
            queryEmployees();
        }
        if (choices === 'add a department'){
            addDepartment();
        }
        if (choices === 'add a role'){
            addRole();
        }
        if (choices === 'add an employee'){
            addEmployee();
        }
    })
}

queryDepartments = () => {
    console.log('Now viewing all departments:\n');
    const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
    connection.query(sql, (err, response) => {
        if (err) throw err;
        console.table(response);
        userOptions();
    })
};

queryRole = () => {
    console.log('Now viewing all roles:\n');
    const sql = `SELECT roles.id, roles.title, department.department_name AS department
    FROM roles INNER JOIN department ON roles.department_id = department.id`;
    connection.query(sql, (err, response) => {
        if (err) throw (err);
        console.table(response);
        userOptions();
    })
};

queryEmployees = () => {
    console.log('Now viewing all employees:\n');
    const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                roles.title,
                department.department_name AS 'department',
                roles.salary FROM employee, roles, department
                WHERE department.id = roles.department_id
                AND roles.id = employee.role_id
                ORDER BY employee.id ASC`;
    connection.query(sql, (err, response) => {
        if (err) throw (err);
        console.table(response);
        userOptions();
    })                
;}

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'Please add a new department',
        }
    ])
    .then((response) => {
        let sql = `INSERT INTO department (department_name) VALUES (?)`;
        connection.query(sql, answer.newDepartment, (err, response) => {
            if (err) throw err;
            console.log(answer.newDepartment + " department has been added!");
            queryDepartments();
        })
    })
}

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Please enter the role you would like to add.',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this new role',
        }
    ]).then((answer) => {
       const params = [answer.role, answer.salary];
       const roleQuery = `SELECT name, id FROM department`;
       connection.promise().query(roleQuery, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id}));
        inquirer.prompt([
        {
            type: 'list',
            name: 'dept',
            message: 'Please select a department for this role.',
            choices: dept
        }
        ])
        .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);
            const newQuery = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ?, ?)`;

            connection.query(newQuery, params, (err, result) => {
                if (err) throw err;
                console.log(answer.role + " has been added.");

                queryRoles();
            })
        })
       })
    })
}

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Please enter the employee's first name",
        }
        {
            type: 'input',
            name: 'lastName',
            message: "Please enter the employee's last name",
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName]
        const roleQuery = `SELECT role.id, role.title FROM role`;
        connection.promise().query(roleQuery, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ id, title }) => ({ name: title, value: id}));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "Please enter the employee's role",
                    choices: roles
                }
            ])
            .then(rolechoice => {
                const role = rolechoice.role;
                params.push(role);
                const managerQuery = `SELECT * FROm employee`;
                connection.promise().query(managerQuery, (err, data) => {
                    if (err) throw err;
                    const managers = data.map(({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Please enter the employee's manager name.",
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const newQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`;

                        connection.query(newQuery, params, (err, result) => {
                        if (err) throw err;
                        console.log('Employee added.')

                        queryEmployees();
                        })
                    })
                })
            })
        })
    })
}