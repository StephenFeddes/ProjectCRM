import "../css/textInput.css";
import { useState, useEffect } from "react";

function TextInput({ inputName, onChange, inputError="", isRequired=false, isSubmitPressed=false }) {
    const [inputValue, setInputValue] = useState(inputError);
    const handleChange = (e) => {
        const inputValue = e.target.value;
        setInputValue(inputValue);
        onChange(inputValue);
    }

    useEffect(() => {
        console.log(inputError);
        if (inputError.length != 0) {
            console.log("Hello");
            setInputValue(inputError);
        }
    }, [inputError, isSubmitPressed]);

    return (
        <div className="text input-container">
            <label class={isRequired ? "required" : ""}>{inputName}</label>
            <input className={(inputError==inputValue && inputValue != "") ? "text-input failed" : "text-input" } type="text" value={inputValue} onChange={handleChange} />
        </div>
    );
}

export default TextInput;