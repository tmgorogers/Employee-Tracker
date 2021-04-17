-- Drops the employeeTracker_db if it exists currently --
DROP DATABASE IF EXISTS employeeTracker_db;
-- Creates the "employeeTracker_db" database --
CREATE DATABASE employeeTracker_db;

-- Makes it so all of the following code will affect employeeTracker_db --
USE employeeTracker_db;

-- Creates the table "department" within eployeeTracker_db --
CREATE TABLE department(
    id int NOT NULL AUTO_INCREMENT,
  -- Makes a string column called "NAME" 
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id int NOT NULL AUTO-AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id   INT NOT NULL,
    PRIMARY KEY (id)
  
);

CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30;)
last_name VARCHAR(30);
    role_id INT NOT NULL,
    isManager= BOOLEAN NOT NULL;
superviserORManager_Id INT,
PRIMARY KEY (Id)
);
