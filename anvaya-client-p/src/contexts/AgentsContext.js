import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { url } from "../api";
import { useAuth } from "./AuthContext";

const AgentContext = createContext();

const AgentProvider = ({ children }) => {
  const { token } = useAuth();
  const [agents, setAgents] = useState([]);
  const addAgents = async (payload) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const resposne = await fetch(`${url}/agents`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await resposne.json();
      if (!resposne.ok) {
        throw new Error(data.message || "Add agents error");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateAgent = async (id, dataToUpdate) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`${url}/agents/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(dataToUpdate),
      });
      return response?.data?.agents;
    } catch (error) {
      console.error(error.message);
    }
  };

  const loadAgents = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`${url}/agents`, {
        method: "GET",
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid agent error");
      }
      setAgents(data.data.agents);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    loadAgents();
  }, []);
  return (
    <AgentContext.Provider
      value={{ agents, setAgents, addAgents, updateAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

const useAgent = () => useContext(AgentContext);

export { AgentProvider, AgentContext, useAgent };
