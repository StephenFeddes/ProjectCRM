import { useState, useEffect } from "react";
import "../css/modalForm.css";
import "../css/buttons/closeButton.css";
import SimpleButton from "./buttons/SimpleButton.jsx";
import TextInput from "./TextInput.jsx";
import PhoneInput from "./phoneInput.jsx";
import ModalForm from "./ModalForm";
import Picklist from "./Picklist.jsx";
import CalendarInput from "./CalendarInput.jsx";
import { API_URL } from "../constants.js";

function EmployeeForm() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [departmentName, setDepartmentName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [hireDate, setHireDate] = useState("");
	const [inputErrors, setInputErrors] = useState([]);
	const [inputError, setInputError] = useState('');
	const [isSubmitPressed, setSubmitPressed] = useState(false);

	useEffect(() => {
		console.log(inputErrors);
		//console.log(firstName);
		setSubmitPressed(!isSubmitPressed);
	  }, [inputErrors]);

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(API_URL+"/employees", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				departmentName: departmentName,
				emailAddress: emailAddress,
				mobileNumber: mobileNumber,
				hireDate: hireDate
			}),
		});

		console.log(hireDate);
		const validatedInputList = await response.json();
		setInputErrors(validatedInputList);
		} catch (e) {
			console.error(e.message);
		}
	};

	return (
		<ModalForm formName="Employee Form" openBtnName="+ Add New">
			<form onSubmit={onSubmitForm}>
				<TextInput inputName="Username" onChange={setLastName} isRequired={true}
					inputError={inputErrors.lastName} isSubmitPressed={isSubmitPressed}
				 />
				<TextInput inputName="Password" onChange={setEmailAddress} isRequired={true}
					inputError={inputErrors.emailAddress} isSubmitPressed={isSubmitPressed} 

				/>
				<TextInput inputName="Confirm Password" onChange={setEmailAddress} isRequired={true}
					inputError={inputErrors.emailAddress} isSubmitPressed={isSubmitPressed} 

				/>
			</form>
		</ModalForm>
	);
}

export default EmployeeForm;