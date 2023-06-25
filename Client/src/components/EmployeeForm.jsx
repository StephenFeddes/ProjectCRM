import { useState, useEffect } from "react";
import "../css/modalForm.css";
import "../css/buttons/closeButton.css";
import SimpleButton from "./buttons/SimpleButton.jsx";
import TextInput from "./TextInput.jsx";
import DropList from "./DropListInput.jsx";
import ModalForm from "./ModalForm";

function EmployeeForm() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [departmentName, setDepartmentName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const departmentList = [
		"Administrative",
		"Sales",
		"Human Resources",
		"Customer Service",
		"Technician",
	];

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:5000/employees", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					departmentName: departmentName,
					emailAddress: emailAddress,
					mobileNumber: mobileNumber,
				}),
			});

			console.log(response);
		} catch (e) {
			console.error(e.message);
		}
	};

	return (
		<ModalForm formName="Employee Form" openBtnName="&#43; Add New">
			<form onSubmit={onSubmitForm}>
				<TextInput inputName="First Name" onValueChange={setFirstName} />
				<TextInput inputName="Last Name" onValueChange={setLastName} />
				<TextInput inputName="Email" onValueChange={setEmailAddress} />
				<TextInput inputName="Mobile" onValueChange={setMobileNumber} />
				<DropList
					listName="Department"
					items={departmentList}
					onValueChange={setDepartmentName}
				/>
				<div className="modal-buttons">
					<SimpleButton type="submit" onClick={onSubmitForm}>Submit</SimpleButton>
					<SimpleButton type="reset" color="grey" onClick={() => console.log()}>Reset</SimpleButton>
				</div>
			</form>
		</ModalForm>
	);
}

export default EmployeeForm;
