/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useAgent } from "../contexts/AgentsContext";
import { useLocation, useNavigate } from "react-router-dom";
import useLoading from "../useLoading";
import { useEffect } from "react";
import { fetchJSON} from "../api";
import { useAuth } from "../contexts/AuthContext";
import LeadCard from "../component/leadcard/LeadCard";
const Leads = () => {
  const { agents = [], tags = [] } = useAgent();
  const { token } = useAuth();
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  const { loading, startLoading, stopLoading } = useLoading();
  const [leads, setLeads] = useState([]);

  // So this function converts URL into an object or if nothing return ""
  const getFiltersFromURL = () => {
    // const sp = new URLSearchParams("?status=New&salesAgent=123");
    // sp.get('status') i.e New 
    const params = new URLSearchParams(location.search);
    return {
      salesAgent: params.get("salesAgent") || "",
    };
  };
  const [filter, setFilters] = useState(getFiltersFromURL());
  console.log("State Filter:",filter);

  // useEffect(() => {
  //   setFilters(getFiltersFromURL());
  // }, [location.search]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filter.salesAgent) params.set("salesAgent", filter.salesAgent);
    navigate(`/leads?${params.toString()}`);
  };

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
      stopLoading();
    };
    fetchLeads();
    // When url change fetch leads
  }, [location.search]);

  function updateFilterField(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }
  return (
    <div>
      <h2 className='fw-bold mb-4 text-center text-md-start'>Leads</h2>
      {/* Filter card */}
      <div className='card mb-3 p-3'>
        <div className='row g-2 align-items-end'>
          {/* Sales agent */}
          <div className='col-md-3'>
            <label className='form-label'>Sales Agent</label>
            <select
              className='form-control'
              value={filter.salesAgent}
              onChange={(e) => updateFilterField("salesAgent", e.target.value)}>
              <option value=''>All</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-2 small'>
            <label className='form-label '>Status</label>
          </div>
          {/* Apply button */}
          <div className='col-md-1 text-end'>
            <button className='btn btn-primary' onClick={applyFilters}>
              Apply
            </button>
          </div>
        </div>
      </div>
      <div>
        {loading ? (
          <p>Loading..</p>
        ) : (
          leads.map((l) => <LeadCard key={l._id} lead={l} />)
        )}
      </div>
    </div>
  );
};
export { Leads };
