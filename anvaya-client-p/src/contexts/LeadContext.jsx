import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../api";
import { useAuth } from "./AuthContext";

const LeadContext = createContext();

const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const { token } = useAuth();

  const fetchLeads = async () => {
    const headers = { "Content-Type": "application.json" };
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    try {
      const respnose = await fetch(`${url}/leads`, {
        method: "GET",
        headers,
      });
      const data = await respnose.json();
      if (!respnose.ok) {
        throw new Error(data.message || "Lead fetch error");
      }
      setLeads(data.data?.leads || []);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);
  return (
    <LeadContext.Provider value={{ leads }}>{children}</LeadContext.Provider>
  );
};
const useLead = () => useContext(LeadContext);
export { LeadProvider, LeadContext, useLead };
