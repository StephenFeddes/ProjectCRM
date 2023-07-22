import "../css/textInput.css";
import { useState, useEffect } from "react";

function TextInput({ inputName, onChange, isRequired = false, }) {
	const [inputValue, setInputValue] = useState();
	const handleChange = (e) => {
		const inputValue = e.target.value;
		setInputValue(inputValue);
		onChange(inputValue);
	};

	return (
		<div className="text input-container">
			<label className={isRequired ? "required" : ""}>{inputName}</label>
			<input
				className="text-input"
				type={inputName.toLowerCase()=="password" ? "password" : "text"}
				value={inputValue}
				onChange={handleChange}
			/>
		</div>
	);
}

export default TextInput;