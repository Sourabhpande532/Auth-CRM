/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useAgent } from "../contexts/AgentsContext";
import { useLocation, useNavigate } from "react-router-dom";
import useLoading from "../useLoading";
import { useEffect } from "react";
import { fetchJSON, url } from "../api";
import { useAuth } from "../contexts/AuthContext";
import LeadCard from "../component/leadcard/LeadCard";
const Leads = () => {
  const { agents = [], tags = [] } = useAgent();
  const { token } = useAuth();
  const location = useLocation();
  console.log(location);
  console.log(location.search);
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
      stopLoading();
    };
    fetchLeads();
    // When url change fetch leads
  }, [location.search]);
  return (
    <div>
      <h2 className='fw-bold mb-4 text-center text-md-start'>Leads</h2>
      {/* Filter card */}
      <div className='card mb-3 p-3'>
        <div className='row g-2 align-items-end'>
          {/* Sales agent */}
          <div className='col-md-3'>
            <label className='form-label'>Sales Agent</label>
            <select className='form-control'>
              <option value=''>All</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 small">
          <label className="form-label ">Status</label>
          </div>
          {/* Apply button */}
          <div className="col-md-1 text-end">
          <button className="btn btn-primary">Apply</button>
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
