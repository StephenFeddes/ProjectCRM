import "../css/navMenu.css"
import { BiSolidBusiness } from 'react-icons/bi';
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

function NavMenu({ children, items }) {

    const [isMenuOpen, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
		const handleClickOutside = (e) => {
            if (menuRef.current != e.target.parentNode && !e.target.classList.contains("menu-link") ) {
                setOpenMenu(false);
            }
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
        <div ref={menuRef} className={isMenuOpen ? "nav-menu active" : "nav-menu"} onClick={() => {
            if (isMenuOpen) {
                //onMenuClick(0);
                setOpenMenu(false);
            }
            else {
                //onMenuClick(menuId);
                setOpenMenu(true);
            }}}>
          <div className="menu-name">
            {children}
            <FaChevronDown className={isMenuOpen ? "arrow up" : "arrow"} />
          </div>
          {isMenuOpen && (
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
}

export default NavMenu;