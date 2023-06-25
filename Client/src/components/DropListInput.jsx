import { useState, useEffect, useRef } from "react";
import "../css/dropList.css";
import "../css/textInput.css";
import { FaChevronDown, FaTimes } from "react-icons/fa";

function DropList({ items, listName, onValueChange }) {
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [selectedItem, setSelectedItem] = useState("");
	const [isListVisible, setListVisibility] = useState(false);
	const [isArrowDown, setArrowOrientation] = useState(true);
	const dropListRef = useRef(null);
	const toggleListVisibility = () => {
		setListVisibility(!isListVisible);
		setArrowOrientation(!isArrowDown);
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				e.target.parentNode !== dropListRef.current &&
				e.target.parentNode.parentNode !== dropListRef.current
			) {
				setListVisibility(false);
				setArrowOrientation(true);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="input-container">
			<label>{listName}</label>
			<div ref={dropListRef} className="drop-list">
				<div onClick={toggleListVisibility} className="open-btn">
					<input type="text" value={selectedItem} />
					<FaTimes
						className="delete"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedItem("");
						}}
					/>
					<FaChevronDown
						onClick={toggleListVisibility}
						className={isArrowDown ? "arrow" : "arrow up"}
					/>
				</div>
				{isListVisible && (
					<ul>
						{items.map((item, index) => (
							<li
								className={selectedIndex === index ? "selected" : ""}
								key={item}
								onClick={() => {
									setSelectedIndex(index);
									setSelectedItem(item);
									toggleListVisibility();
									onValueChange(item);
								}}
							>
								{item}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default DropList;
