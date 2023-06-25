import "../css/textInput.css";

function TextInput({ inputName, onValueChange }) {
    return (
        <div className="input-container">
            <label>{inputName}</label>
            <input className="text-input" type="text" onChange={(e) => onValueChange(e.target.value)} />
        </div>
    );
}

export default TextInput;