import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TbCalendarEvent } from "react-icons/tb";
import "../css/calendarInput.css";
import { format } from 'date-fns';

function CalendarInput({ inputName, onChange }) {
	const [selectedDate, setSelectedDate] = useState(null);
	const datePickerRef = useRef(null);

	const handleDateChange = (date) => {
		setSelectedDate(date);
        onChange(format(date, 'MM/dd/yyyy'));
	};

	const handleIconClick = () => {
		datePickerRef.current.setOpen(true);
	};

	return (
		<>
			<div className="date-input" onClick={handleIconClick}>
                <label>{inputName}</label>
				<input
					type="text"
					value={selectedDate ? selectedDate.toLocaleDateString("en-US") : ""}
					readOnly
				/>
				<TbCalendarEvent className="calendar-icon" />
			</div>
			<DatePicker
				selected={selectedDate}
				onChange={handleDateChange}
				showPopperArrow={false}
				customInput={<></>}
				ref={datePickerRef}
				dateFormat="MM/dd/yyyy"
                showYearDropdown

			/>
		</>
	);
}

export default CalendarInput;
