import { useState, useEffect, useRef } from "react";
import "../css/pickList.css";
import "../css/phoneInput.css";
import { FaChevronDown, FaTimes } from "react-icons/fa";

function PhoneInput({ fieldName, onChange, countryFlagDefault, phoneIddDefault }) {
	const [countryCode, setCountryCode] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [numbers, setNumbers] = useState('');
	const [countryFlag, setCountryFlag] = useState(countryFlagDefault);
	const [countryList, setCountryList] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [filteredCountryList, setFilteredCountryList] = useState([]);
	const [phoneIdd, setPhoneIdd] = useState(phoneIddDefault);
	const [isListVisible, setListVisibility] = useState(false);
	const [isArrowDown, setArrowOrientation] = useState(true);
	const picklistRef = useRef(null);
	const toggleListVisibility = () => {
		setListVisibility(!isListVisible);
		setArrowOrientation(!isArrowDown);
	};
	const handlePhoneInputChange = (event) => {
		const inputNumbers = event.target.value;
		const newPhoneNumber = phoneIdd + " " + inputNumbers;
	  
		setNumbers(inputNumbers);
		setPhoneNumber(newPhoneNumber);
		onChange(newPhoneNumber);
	};
	const handleSearchChange = (event) => {
		const searchValue = event.target.value;
		setSearchValue(searchValue);
		const filteredCountries = countryList.filter((country) =>
			country.name.common.toLowerCase().includes(searchValue.toLowerCase())
		);
		setFilteredCountryList(filteredCountries);
	};
	const selectCountry = (country) => {
		setCountryCode(country.cca3);
		setCountryFlag(country.flags.png);
		setPhoneIdd(country.idd.root);
		setPhoneNumber(country.idd.root+" "+numbers);
		onChange(country.idd.root+" "+numbers);
	};

	useEffect(() => {
		const fetchCountryList = async () => {
			try {
				const response = await fetch(
					"https://restcountries.com/v3.1/all?fields=flags,idd,name,independent,area,cca3"
				);
				let countryList = await response.json();
				countryList = countryList.filter((country) => country.independent);
				countryList = countryList.sort((a, b) => b.area - a.area);

				setFilteredCountryList(countryList);
				setCountryList(countryList);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		const handleClickOutside = (e) => {
			if (
				e.target.parentNode !== picklistRef.current &&
				e.target.parentNode.parentNode !== picklistRef.current
			) {
				setListVisibility(false);
				setArrowOrientation(true);
			}
		};

		fetchCountryList();
		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div ref={picklistRef} className="phone picklist">
			<div className="input-container">
				<div className="flag-container" onClick={toggleListVisibility}>
					<img
						className="flag"
						src={countryFlag}
						alt="flag"
					/>
					<FaChevronDown className={isArrowDown ? "arrow" : "arrow up"} />
				</div>
				<input className="selected-input" type="text" placeholder={fieldName} onChange={handlePhoneInputChange} />
			</div>
			{isListVisible && (
			<div className="list">
				<input
					type="text"
					placeholder="Search"
					className="search"
					value={searchValue}
					onChange={handleSearchChange}
				/>
				<ul>
				{filteredCountryList.map((country, index) => (
					<li
						className={country.cca3 === countryCode ? "selected" : ""}
						key={country.cca3}
						onClick={() => {
							selectCountry(country);
							toggleListVisibility();
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