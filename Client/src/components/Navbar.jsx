import "../css/navbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../constants.js";
import { useAuth } from "./Authentication/AuthContext";
import { RiLogoutCircleRLine } from 'react-icons/ri';
import NavMenu from "./NavMenu";

function Navbar() {
    const { setIsAuthenticated } = useAuth();
    const [username, setUsername] = useState("");
    const [openMenuId, setOpenMenuId] = useState(0);
    async function getName()
    {
        try {
            const response = await fetch(API_URL+"/current-user/", {
                method: "GET",
                headers: {token: localStorage.token}
            })

            const employee = await response.json();
            setUsername(employee.username);

        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        getName();
        console.log(openMenuId);
    }, [openMenuId]);
    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    }

	return (
        <nav>
            <NavMenu 
            items={
                [
                <Link className="menu-link" to="/modules/employees">Employees</Link>, 
                <Link className="menu-link" to="/modules/departments">Departments</Link>
                ]
            }>
            Company
            </NavMenu>
            <NavMenu
            items={
                [
                <Link className="menu-link" to="/modules/vendors">Vendors</Link>, 
                <Link className="menu-link" to="/modules/inventory">Inventory</Link>
                ]
            }>
            Supplies
            </NavMenu>
            <div className="logout">
                <i>{username}</i>
                <RiLogoutCircleRLine className="logout-btn" onClick={() => logout()} />
            </div>
        </nav>
	);
}

export default Navbar;