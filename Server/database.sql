CREATE DATABASE crm;

CREATE TABLE employee(
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) UNIQUE,
    phone_number VARCHAR(255) UNIQUE
);

SELECT COUNT(*) as count FROM employee WHERE email_address = 'sfedes@outlook.com';