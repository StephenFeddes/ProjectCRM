const conn = require('../db');

class InputValidator {
  constructor(fieldName="", validationInput=null) {
    this.isValid = true; // Change this to a regular class property
    this.validationMessage = "";
    this.fieldName = fieldName;
    this.validationInput = validationInput;
  }

  setIsValid(isValid) { this.isValid = isValid; }
  getIsValid() { return this.isValid; }
  setValidationInput(validationInput) { this.validationInput = validationInput; }
  getValidationInput() { return this.validationInput; }
  setValidationMessage(message) { this.validationMessage = message; }
  getValidationMessage() { return this.validationMessage; }
  getFieldName() { return this.fieldName; } // Return 'fieldName' instead of 'isValid'

  async validate(validationInput) {
    throw new Error("This method must be overridden in subclasses.");
  }
}

class RequiredInputValidator extends InputValidator {
  async validate() {
    if (this.getValidationInput().replace(" ", "") == "") {
      this.setIsValid(false);
      this.setValidationMessage(this.getFieldName() + " is required."); // Corrected method name
    } else {
      this.setIsValid(true);
    }
  }
}

class PhoneInputValidator extends InputValidator {
  async validate() {
    const phoneNumberRegex = /^\+\d{1,3}(?:[\s()-]?\d{3}){2}(?:[\s()-]?\d{4})$/;
    
    if (phoneNumberRegex.test(this.getValidationInput())) {
      this.setIsValid(true);
    }
    else {
      this.setIsValid(false);
      this.setValidationMessage("Invalid phone number");
    }
  }
}

class EmailInputValidator extends InputValidator {
  async validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pattern for email validation

    if (emailRegex.test(this.getValidationInput())) {
      this.setIsValid(true);
    }
    else
    {
      this.setIsValid(false);
      this.setValidationMessage("Invalid email");
    }
  }
}

class UniqueInputValidator extends InputValidator {
  async validate() {
    const table = this.getValidationInput().table;
    const column = this.getValidationInput().column;
    const value = this.getValidationInput().value;
    const ignoreId = this.getValidationInput().ignoreId ?? null;
  
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
  
    if (duplicateRowsCount !== 0) {
      this.setIsValid(false);
      this.setValidationMessage(this.getFieldName() + " must be unique");
    }
    else {
      this.setIsValid(true);
    }
  }
}

class PasswordInputValidator extends InputValidator {
  async validate() {
    if (this.getValidationInput().password == this.getValidationInput().repeat_password) {
      this.setIsValid(true);
    }
    else {
      this.setIsValid(false);
      this.setValidationMessage("Passwords do not match");
    }
  }
}

class Validation {
  constructor(validators) {
    this.validators = validators;
    this.validationErrors = [];
  }

  async runValidation() {
    for (const validator of this.validators) {
      await validator.validate();
      if (!validator.getIsValid()) {
        this.validationErrors.push(validator.getValidationMessage());
      }
    }
    return this.validationErrors;
  }
}


function validatePassword(password, repeatPassword)
{
  if (password == repeatPassword) {
    return true;
  }
  else 
  {
    return false;
  }
}

module.exports = {
  RequiredInputValidator: RequiredInputValidator,
  UniqueInputValidator: UniqueInputValidator,
  EmailInputValidator: EmailInputValidator,
  PhoneInputValidator: PhoneInputValidator,
  PasswordInputValidator: PasswordInputValidator,
  Validation: Validation
}