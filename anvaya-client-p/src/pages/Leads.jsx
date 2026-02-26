import { useState } from "react";
import { useAgent } from "../contexts/AgentsContext";
import { useLocation, useNavigate } from "react-router-dom";
import useLoading from "../useLoading";
import { useEffect } from "react";
import { fetchJSON, url } from "../api";
import { useAuth } from "../contexts/AuthContext";
const Leads = () => {
  const { agents = [], tags = [] } = useAgent();
  const { token } = useAuth();
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  const { loading, startLoading, stopLoading } = useLoading();
  const [leads, setLeads] = useState([]);
  console.log(leads);

  useEffect(() => {
    const fetchLeads = async () => {
      startLoading();
      try {
        const response = await fetchJSON("/leads" + location.search, {}, token);
        setLeads(response?.data?.leads || []);
      } catch (error) {
        console.error(error);
        setLeads([]);
      }
    };
    fetchLeads();
    // When url change fetch leads
  }, [location.search]);
  return (
    <div>
      <h2>Leads Page</h2>
    </div>
  );
};
export { Leads };
