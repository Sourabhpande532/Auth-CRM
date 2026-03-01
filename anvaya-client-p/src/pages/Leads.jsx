/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useAgent } from "../contexts/AgentsContext";
import { useLocation, useNavigate } from "react-router-dom";
import useLoading from "../useLoading";
import { useEffect } from "react";
import { fetchJSON } from "../api";
import { useAuth } from "../contexts/AuthContext";
import LeadCard from "../component/leadcard/LeadCard";
const Leads = () => {
  const { agents = [], tags = [] } = useAgent();
  const [leads, setLeads] = useState([]);
  const { token } = useAuth();
  const location = useLocation();
  console.log("....", location.search);
  const navigate = useNavigate();
  const { loading, startLoading, stopLoading } = useLoading();

  /* 
✅ Initial page load
✅ Page refresh
✅ Direct link open
✅ Browser back button
🔥 Real Example

Imagine you copy URL:

/leads?salesAgent=999
And open in new tab.
What happens?
Component loads fresh.

Now:
useState(getFiltersFromURL());
Runs again.
It reads:
params.get("salesAgent") → "999"
Dropdown automatically selects 999.

That’s why we use it.
below code why need this region
*/

  // 1️⃣ Read filter from URL
  // So this function converts URL into an object or if nothing return ""
  const getFiltersFromURL = () => {
    // const sp = new URLSearchParams("?status=New&salesAgent=123");
    // sp.get('status') i.e New
    const params = new URLSearchParams(location.search);
    return {
      salesAgent: params.get("salesAgent") || "",
      status: params.get("status") || "",
      source: params.get("source") || "",
      tags: params.get("tags") || "",
      sortBy: params.get("sortBy") || "",
      sortDir: params.get("sortDir") || "asc",
    };
  };

  // {salesAgent: ''}
  // console.log("....",getFiltersFromURL());

  // 2️⃣ Store in state
  const [filter, setFilters] = useState(getFiltersFromURL());
  // {salesAgent: '6974ad1e3394b5b0d382fa32'}
  console.log("State Filter:", filter);

  // useEffect(() => {
  //   setFilters(getFiltersFromURL());
  // }, [location.search]);
  /* 
If you enable this:
Then whenever URL changes → it re-reads URL → updates state.
This is useful when:
User presses back button
User manually edits URL
 */

  // 3 Update USER edit state
  function updateFilterField(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  // Step 4: Apply → update URL sharable
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filter.salesAgent) params.set("salesAgent", filter.salesAgent);
    // salesAgent=6974ad1e3394b5b0d382fa32
    if (filter.status) params.set("status", filter.status);
    if (filter.source) params.set("source", filter.source);
    if (filter.tags) params.set("tags", filter.tags);
    if (filter.sortBy) {
      params.set("sortBy", filter.sortBy);
      params.set("sortDir", filter.sortDir || "asc");
    }

    // That is the ONLY thing that changes location.search.
    navigate(`/leads?${params.toString()}`);
  };

  // Step 5: useEffect listens to URL → fetch data
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
          {/* STATUS */}
          <div className='col-md-2 small'>
            <label className='form-label '>Status</label>
            <select
              className='form-select'
              value={filter.status}
              onChange={(e) => updateFilterField("status", e.target.value)}>
              <option value=''>All</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal Sent</option>
              <option>Closed</option>
            </select>
          </div>
          {/* Source */}
          <div className='col-md-2'>
            <label className='form-label small'>Source</label>
            <select
              className='form-select'
              value={filter.source}
              onChange={(e) => updateFilterField("source", e.target.value)}>
              <option value=''>All</option>
              <option>Website</option>
              <option>Referral</option>
              <option>Advertisement</option>
              <option>Email</option>
              <option>Other</option>
            </select>
          </div>
          <div className='col-md-2'>
            <label className='form-label small'>Tags</label>
            <select
              className='form-select'
              value={filter.tags}
              onChange={(e) => updateFilterField("tags", e.target.value)}>
              <option value=''>All</option>
              {tags.map((t) => (
                <option key={t._id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          {/* Sort */}
          <div className='col-md-1'>
            <label className='form-label'>Sort</label>
            <select
              className='form-select'
              value={filter.sortBy}
              onChange={(e) => updateFilterField("sortBy", e.target.value)}>
              <option value=''>All</option>
              <option value='updatedAt'>UpdatedAt</option>
              <option value='createdAt'>CreatedAt</option>
              <option value='priority'>Priority</option>
              <option value='status'>Status</option>
            </select>
          </div>
          {/* Sort dir */}
          <div className='col-md-1'>
            <label className='form-label small'>Dir</label>
            <select
              className='form-select'
              value={filter.sortDir}
              onChange={(e) => updateFilterField("sortDir", e.target.value)}>
              <option value='asc'>Asc</option>
              <option value='desc'>Desc</option>
            </select>
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
