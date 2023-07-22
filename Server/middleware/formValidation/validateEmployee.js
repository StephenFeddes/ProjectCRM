const { 
    RequiredInputValidator, 
    UniqueInputValidator, 
    EmailInputValidator,
    PhoneInputValidator,
    PasswordInputValidator,
    Validation
} = require('../../utils/validate.js');



module.exports = async (req, res, next) => {
    try {
        const employee = req.body;

        async function validateEmployeeInput()
        {
            return {
                first_name: await new Validation([
                    new RequiredInputValidator("First name", employee.first_name)
                ]).runValidation()
                ,
                last_name: await new Validation([
                    new RequiredInputValidator("Last name", employee.last_name)
                ]).runValidation()
                ,
                username: await new Validation([
                    new RequiredInputValidator("Username", employee.username),
                    new UniqueInputValidator("Username", {
                        table: 'employee', 
                        column: "username", 
                        value: employee.username
                    })
                ]).runValidation()
                ,
                email_address: await new Validation([
                    new EmailInputValidator("", employee.email_address),
                    new UniqueInputValidator("Email", {
                        table: 'employee', 
                        column: "email_address", 
                        value: employee.email_address
                    })
                ]).runValidation()
                ,
                mobile_number: await new Validation([
                    new PhoneInputValidator("", employee.mobile_number),
                    new UniqueInputValidator("Mobile number", {
                        table: 'employee', 
                        column: "mobile_number", 
                        value: employee.mobile_number
                    })
                ]).runValidation()
                ,
                password: await new Validation([
                    new RequiredInputValidator("Password", employee.password),
                    new PasswordInputValidator("", {
                        password: employee.password, 
                        repeat_password: employee.repeat_password
                    })
                ]).runValidation()
            };
        }

        console.log(employee.repeat_password);
        console.log(employee.password);

        const totalValidationErrors = await validateEmployeeInput().map

        if (Object.values(await validateEmployeeInput()).flat().length > 0) {
            res.json(await validateEmployeeInput());
        }
        else {
            next();
        }

        res.json(Object.values(await validateEmployeeInput()).flat());




    } catch (err) {
        console.error(err.message);
    }
}