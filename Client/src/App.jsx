import { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./components/Authentication/AuthContext.jsx";
import { AuthProvider } from "./components/Authentication/AuthContext.jsx";
import LoginForm from "./components/Authentication/LoginForm.jsx";
import Dashboard from "./components/Modules/Dashboard.jsx";
import ProtectedRoutes from "./components/Authentication/ProtectedRoutes.jsx";
import ModuleLayout from "./components/ModuleLayout.jsx";

function LoginRedirect() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/modules/dashboard" replace />;
  } else {
    return <LoginForm />;
  }
}

function App() {
	return (
		<>
			<AuthProvider>
				<Routes>
					<Route exact path="/login" element={<LoginRedirect />} />
					<Route exact path="/*" element={<ProtectedRoutes />} />
				</Routes>
			</AuthProvider>
		</>
	);
}

export default App;
