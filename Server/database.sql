CREATE DATABASE crms;

CREATE TABLE address(
    address_id SERIAL PRIMARY KEY,
    street_address VARCHAR(255),
    city_name VARCHAR(255),
    state_name VARCHAR(255),
    postal_code VARCHAR(255),
    country_name VARCHAR(255)
);

CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    manager_id INT,
    parent_department_id INT REFERENCES department (department_id) ON DELETE SET NULL
);

-- Step 2: Create the employee table without the foreign key constraint to department
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(255) UNIQUE,
    salary_yearly DECIMAL(12,2),
    hire_date DATE,
    occupation_id INT,
    home_address_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (occupation_id) REFERENCES occupation (occupation_id) ON DELETE CASCADE
    FOREIGN KEY (home_address_id) REFERENCES address (address_id) ON DELETE SET NULL
);

CREATE TABLE occupation (
    occupation_id SERIAL PRIMARY KEY,
    occupation_title VARCHAR(255) UNIQUE NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (occupation_id) REFERENCES occupation (occupation_id) ON DELETE CASCADE
)

-- Step 3: Add the foreign key constraint from department to employee
ALTER TABLE department ADD FOREIGN KEY (manager_id) REFERENCES employee (employee_id) ON DELETE SET NULL;
