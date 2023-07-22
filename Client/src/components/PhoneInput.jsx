import { useState, useEffect, useRef, useReducer } from "react";
import "../css/pickList.css";
import "../css/phoneInput.css";
import { FaChevronDown, FaTimes } from "react-icons/fa";

const initialState = {
	numbers: "",
	phoneNumber: "",
	initialCountryList: "",
	searchValue: "",
	filteredCountryList: "",
	isArrowDown: true,
	selectedCountry: null
}

const reducer = (state, action) => {
	switch(action.type) {
		case "SELECT_COUNTRY":
			return updatedState = { ...state, ...action.payload };
		case "INITIALIZE_COUNTRY_LIST":
			return {...state, ...action.payload };
		case "TOGGLE_LIST":
			return {...state, isArrowDown: !state.isArrowDown};
		case "CLOSE_LIST":
			return {...state, isArrowDown: true};
		default:
			return state;
	}
}

const PhoneInput = ({ fieldName, onChange, defaultIsoAlpha3Code }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const openListRef = useRef(null);

	useEffect( () => {
		const initializeCountryList = async () => {
			try {
				const countriesResponse = await fetch(
				"https://restcountries.com/v3.1/all?fields=flags,idd,name,independent,area,cca3"
				);
				let countryList = await countriesResponse.json();
				countryList = countryList.filter((country) => country.independent);
				countryList = countryList.sort((a, b) => b.area - a.area);
				const initialCountry = countryList.find(
				(country) => country.cca3 === defaultIsoAlpha3Code);
	  
			dispatch({
				type: "INITIALIZE_COUNTRY_LIST",
				payload: {
				  filteredCountryList: countryList,
				  initialCountryList: countryList,
				  selectedCountry: initialCountry
				},
			});
			} catch (error) {
				console.error("Error:", error);
			}
		}

		const handleClickOutside = (e) => {
			if (
				e.target.parentNode != openListRef.current &&
				e.target != openListRef.current
			) {
				dispatch({ type: "CLOSE_LIST"})
			}
		};

		initializeCountryList();
		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="phone picklist">
		  <div className="input-container">
			<div
			  ref={openListRef}
			  className="flag-container"
			  onClick={() => dispatch({ type: "TOGGLE_LIST" })}
			>
			  {state.selectedCountry && (
				<img
				  className="flag"
				  src={state.selectedCountry.flags.png}
				  alt="flag"
				/>
			  )}
			  <FaChevronDown className={state.isArrowDown ? "arrow" : "arrow up"} />
			</div>
			<input className="selected-input" type="text" placeholder={fieldName} />
		  </div>
		  {!state.isArrowDown && (
			<div className="list">
			  <input
				type="text"
				placeholder="Search"
				className="search"
				value={state.searchValue}
				onChange={() => dispatch({ type: "TOGGLE_LIST" })}
			  />
			  <ul>
				{state.filteredCountryList.map((country, index) => (
				  <li
					className={country.cca3 == state.selectedCountry.cca3 ? "selected" : ""}
					key={country.cca3}
					onClick={() => {
					  const updatedState = {
						...state,
						selectedCountry: country,
					  };
					  onChange(updatedState.selectedCountry.idd.root + " " + state.numbers);
					  dispatch({ type: "SELECT_COUNTRY", payload: updatedState });
					  dispatch({ type: "TOGGLE_LIST" });
					}}
				  >
					<img className="flag" src={country.flags.png} alt="flag" />
					{country.name.common}
				  </li>
				))}
			  </ul>
			</div>
		  )}
		</div>
	  );
}

export default PhoneInput;