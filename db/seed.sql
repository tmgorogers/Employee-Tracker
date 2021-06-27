USE employeeTracker_db;

--add departments
INSERT INTO department
(name)
VALUES
('Management');
INSERT INTO department
(name)
VALUES
('Employment');
INSERT INTO department
(name)
VALUES
("Engineering")
INSERT INTO department
(name)
('Sales');

--add roles
INSERT INTO role
	(title, salary, department_id)
VALUES
    ("Manager", "50000", 1);
    
   INSERT INTO role
	(title, salary, department_id)
VALUES
    (" Assistant Manager", "40000", 1); 
    
    INSERT INTO role
	(title, salary, department_id)
VALUES
    ("HR", "65000", 2);
    
    INSERT INTO role
	(title, salary, department_id)
VALUES
    ("HR Lead", "50000", 2);
    
    
INSERT INTO role
	(title, salary, department_id)
VALUES
    ("Software Engineer", "90000", 3);
    
    INSERT INTO role
	(title, salary, department_id)
VALUES
    ("Jr Engineer", "60000", 3);
    
    INSERT INTO role
	(title, salary, department_id)
VALUES
    ("Sales Rep", "55000", 4);
    
    INSERT INTO role
	(title, salary, department_id)
VALUES
    ("Sales Rep2", "52000", 4);

  INSERT INTO employee
(first_name, last_name, role_id, isManager)
VALUES
("Tierra", "Rogers", 1, true);

INSERT INTO employee
(first_name, last_name, role_id, isManager, superviserORManager_Id)
VALUES
("Zambia", "Rogers", 2, false, 1);

INSERT INTO employee
(first_name, last_name, role_id, isManager)
VALUES
("Chris", "Bo", 3, true);

INSERT INTO employee
(first_name, last_name, role_id, isManager, superviserORManager_id)
VALUES
("Issa", "Rae", 4, false, 2);

INSERT INTO employee
(first_name, last_name, role_id, isManager)
VALUES
("Tab", "Hill", 5, true);

INSERT INTO employee
(first_name, last_name, role_id, isManager, superviserORManager_id)
VALUES
("Brent", "Roger", 6, false, 3);

INSERT INTO employee
(first_name, last_name, role_id, isManager)
VALUES
("Ann", "Mae", 7, true);

INSERT INTO employee
(first_name, last_name, role_id, isManager, superviserORManager_id)
VALUES
("Carl", "Turner", 8, false, 4);



  