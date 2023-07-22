import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function ModuleLayout() {

	return (
        <>
        <Navbar />
        <Outlet />
        </>
	);
}

export default ModuleLayout;