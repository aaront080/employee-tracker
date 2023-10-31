INSERT INTO department(department_name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO roles(title, department_id, salary)
VALUES ('Sales Lead', 1, 100000), ('Saleperson', 1, 80000), ('Lead Engineer', 2, 150000), ('Software Engineer', 2, 120000), ('Account Manager', 3, 160000), ('Accountant', 3, 125000), ('Legal Team Lead', 4, 250000), ('Lawyer', 4, 190000);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Aaron', 'Torres', 1, )