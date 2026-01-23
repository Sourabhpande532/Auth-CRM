import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const isAuthenticated = !!token;
  const login = (newToken) => {
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
  };
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };
  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);
export { AuthContext, AuthProvider, useAuth };
