CREATE DATABASE crms;

CREATE TABLE address(
    address_id SERIAL PRIMARY KEY,
    street_number VARCHAR(255),
    street_name VARCHAR(255),
    city_name VARCHAR(255),
    state_name VARCHAR(255),
    zip_code VARCHAR(255),
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
    email_address VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(255) UNIQUE,
    salary_yearly DECIMAL(12,2),
    hire_date DATE,
    department_id INT,
    home_address_id INT,
    FOREIGN KEY (department_id) REFERENCES department (department_id) ON DELETE SET NULL
);

-- Step 3: Add the foreign key constraint from department to employee
ALTER TABLE department ADD FOREIGN KEY (manager_id) REFERENCES employee (employee_id) ON DELETE SET NULL;


class Address(models.Model):
    address_id = models.AutoField(primary_key=True)
    street_number = models.CharField(null=True)
    street_name = models.CharField(max_length=255, null=True)
    city_name = models.CharField(max_length=255, null=True)
    state_name = models.CharField(max_length=255, null=True)
    zip_code = models.CharField(max_length=255, null=True)
    country_name = models.CharField(max_length=255, null=True)

    class Meta:
        db_table = 'address'

employee = Employee.objects.get(pk=1)
print(employee)


class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=255, null=False)
    manager_id = models.ForeignKey('crms.Employee', on_delete=models.SET_NULL, null=True, db_column='manager_id')
    parent_department_id = models.ForeignKey('self',on_delete=models.SET_NULL, null=True, db_column='parent_department_id')

    class Meta:
        db_table = 'department'

SELECT COUNT(*) as count FROM employee WHERE email_address = 'sfedes@outlook.com';

class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    department_id = models.ForeignKey('crms.Department', on_delete=models.SET_NULL, null=True, db_column='department_id')
    salary_yearly = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    email_address = models.CharField(max_length=255, null=True)
    phone_number = models.CharField(max_length=255, null=True)
    hire_date = models.DateField(null=True)
    home_address_id = models.ForeignKey('crms.Address', on_delete=models.SET_NULL, null=True, db_column='home_address_id')

    @staticmethod
    def format_date(date_string, input_format, output_format):
        try:
            date_obj = datetime.strptime(date_string, input_format)
            formatted_date = date_obj.strftime(output_format)
            return formatted_date
        except ValueError:
            return None
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
        
    class Meta:
        db_table = 'employee'
