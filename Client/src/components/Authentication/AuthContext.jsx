import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from "../../constants.js";

// Create the context
const AuthContext = createContext();

// Create a custom hook to access the authentication state
export function useAuth() {
  return useContext(AuthContext);
}

// Create the AuthProvider component to wrap the App component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function checkAuthentication() {
    try {
      const response = await fetch(API_URL+"/auth/is-authenticated", {
        method: "GET",
        headers: { token: localStorage.token }
      })

      const isAuthentic = await response.json();

      isAuthentic == true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    checkAuthentication();
  });

  // Other authentication logic...

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}