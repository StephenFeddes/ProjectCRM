import { useState, useEffect, useRef } from "react";
import "../css/pickList.css";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { RxCross1 } from 'react-icons/rx';
import { API_URL } from "../constants.js";

function Picklist({ onChange, inputName, itemsEndpoint, itemFieldName, isRequired=false}) {
	const [searchValue, setSearchValue] = useState("");
    const [itemList, setItemList] = useState([]);
	const [filteredItemList, setFilteredItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
	const [isListVisible, setListVisibility] = useState(false);
	const [isArrowDown, setArrowOrientation] = useState(true);
	const picklistRef = useRef(null);
	const toggleListVisibility = () => {
		setListVisibility(!isListVisible);
		setArrowOrientation(!isArrowDown);
	};
	const handleSearchChange = (event) => {
		const searchValue = event.target.value;
		setSearchValue(searchValue);
		const filteredItems = itemList.filter((item) =>
			item.toLowerCase().includes(searchValue.toLowerCase())
		);
		setFilteredItemList(filteredItems);
	};

	useEffect(() => {
		const fetchItemList = async () => {
			try {
				const response = await fetch(API_URL+itemsEndpoint);
				let items = await response.json();
				console.log(items[0][itemFieldName]);
				items = items.map(item => item[itemFieldName])
				setItemList(items);
				setFilteredItemList(items);
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

		fetchItemList();
		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div ref={picklistRef} className="picklist">
			<div onClick={toggleListVisibility} className="input-container">
				<label>{inputName}</label>
				<input className="selected-input" type="text" value={selectedItem} />
				<RxCross1
					className="delete"
					onClick={(e) => {
						e.stopPropagation();
						setSelectedItem("");
					}}
				/>
				<FaChevronDown className={isArrowDown ? "arrow" : "arrow up"} />
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
				{filteredItemList.map((item, index) => (
					<li
						className={item === selectedItem ? "selected" : ""}
						key={index}
						onClick={() => {
							setSelectedItem(item);
							toggleListVisibility();
							onChange(item);
						}}
					>
						{item}
					</li>
				))}
				</ul>
			</div>
		)}
		</div>
	);
}

export default Picklist;