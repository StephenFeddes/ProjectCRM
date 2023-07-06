const conn = require('./db');
const emailValidationApiKey = "58eaed41dbf940958acdc704ddfed128"; // abstractapi.com api for email validation
const phoneValidationApiKey = "5562436c55c8b62e1a94b67115c7a1e7"; // numverify.com api for number validation


async function validate(rules) {
    const errors = {};
    isValidationPassed = true;
  
    for (const fieldName of Object.keys(rules)) {
      const rule = rules[fieldName];
      const errorsForField = [];
  
      if (!validateRequired(rule.required)) {
        errorsForField.push(`${rule.fieldName} is required`);
        isValidationPassed = false;
      }
  
      try {
        const isUnique = await validateUnique(rule.unique);
        if (!isUnique) {
          errorsForField.push(`${rule.fieldName} must be unique`);
          isValidationPassed = false;
        }
      } catch (err) {
        // Handle validation error
      }

      try 
      {
        if (rule.phone.number) 
        {
            const mobileNumberValidationData = await validatePhoneNumber(rule.phone.number, rule.phone.line);
            const isMobileNumberValid = mobileNumberValidationData.isValid;

            if (!isMobileNumberValid) {
            errorsForField.push(mobileNumberValidationData.reason);
            isValidationPassed = false;
            }
        }
      } catch (err) {
        // Handle validation error
      }

      errors[fieldName] = errorsForField;
    }

    errors["isValidationPassed"] = isValidationPassed;
  
    return errors;
}

async function validatePhoneNumber(phoneNumber, lineType="")
{
  // Phonenumber format: 17089645875
    try {
        const request = await fetch(`http://apilayer.net/api/validate?number=${phoneNumber}&access_key=${phoneValidationApiKey}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const response = await request.json();

        if (response.valid && (response.line_type == lineType || lineType == ""))
        {
            return {"isValid": true}
        }
        else if (!response.valid)
        {
            return {"isValid": false, "reason": "Number doesn't exist"};
        }
        else if (response.line_type != lineType)
        {
            return {"isValid": false, "reason": `Line type must be ${lineType}`};
        }
    } catch (e) {
        console.error(e.message);
    }
}

function validateRequired(value) 
{
    if (value == "") {
        return false;
    }
    else {
        return true;
    }
}

async function validateUnique(data) 
{
    const table = data.table;
    const column = data.column;
    const value = data.value;
    const ignoreId = data.ignoreId ?? null;
  
    let fetchDuplicateRowsCount;
  
    if (ignoreId) {
      const primaryKeyResult = await conn.query(
        `SELECT a.attname as primary_key
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary;`,
        [table]
      );
  
      const primaryKey = primaryKeyResult.rows[0].primary_key;
  
      fetchDuplicateRowsCount = await conn.query(
        `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1 AND ${primaryKey} != $2`,
        [value, ignoreId]
      );
    } else {
      fetchDuplicateRowsCount = await conn.query(
        `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1`,
        [value]
      );
    }
  
    const duplicateRowsCount = parseInt(fetchDuplicateRowsCount.rows[0].count);
  
    return duplicateRowsCount === 0;
}

async function validateEmail(emailAddress)
{
    try {
        const request = await fetch(`https://emailvalidation.abstractapi.com/v1/?email=${emailAddress}&api_key=${emailValidationApiKey}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const response = await request.json();
        if (response.deliverability == "DELIVERABLE")
        {
            return true;
        }
        else
        {
            return false;
        }
    } catch (e) {
        console.error(e.message);
    }
}

module.exports = {
    validateUnique: validateUnique,
    validate: validate,
    validateEmail: validateEmail,
    validatePhoneNumber: validatePhoneNumber
}