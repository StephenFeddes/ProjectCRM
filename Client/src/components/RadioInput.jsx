function RadioInput({ inputName, radioItems, onInputChange }) {
    return (
        <div>
			{radioItems.map((item, index) => (
			<div key={index}>
				<input type="radio" id={`${inputName} ${index}`} name="options" value={item} onChange={(e) => onInputChange(e.target.value)} />
				<label htmlFor={`option${index}`}>{item}</label>
			</div>
			))}
    	</div>
    );
}

export default RadioInput;