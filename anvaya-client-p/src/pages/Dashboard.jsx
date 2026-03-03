import { Link } from "react-router-dom";
import { url } from "../api";
import { useLead } from "../contexts/LeadContext";
import { useFetch } from "../userFetch";
import { StatusAnalysis } from "../component/analysis/StatusAnalysis";
const Dashboard = () => {
  const { data, error } = useFetch(`${url}/admin/main`);
  const { leads } = useLead();
  const modifyLeads = leads.slice(0, 5);
  const updateLeads = modifyLeads.map((l) => ({
    ...l,
    label: l.status === "New" ? "25% Off" : "No Offer",
  }));
  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading..</p>;
  // console.log(leads);
  
  return (
    <div>
      <h2>Dashboard Page</h2>
      <p>{data.message}</p>
      <p>
        Hello, this is {data.user.role}-{data.user.email}
      </p>
      <hr />
      <div className='row g-3'>
        {updateLeads.map((l) => (
          <div key={l._id} className='col-md-4'>
            <div className='card border-0 shadow-lg p-2'>
              <header className='card-header'>
                <Link to={`/leads/${l._id}`}>{l.name}</Link> (
                <span>{`${l.salesAgent.name}`}</span>)
              </header>
              <div className='card-body'>
                <p>Source: {l.source}</p>
                <p>Status: {l.status}</p>
                <p>Lable: {l.label}</p>
              </div>
            </div>
          </div>
        ))}
        {/* STATUS + FILTERS */}
        <div className='col-lg-8'>
          <div className='card shadow-sm p-4'>
            <h6 className='fw-semibold mb-3'>Lead Status</h6>
            <hr />
            <StatusAnalysis />
            <h6 className='fw-semibold mb-2'>Quick Filters</h6>
            <div className='d-flex gap-2 flex-wrap'>
              {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
                (status) => (
                  <Link
                    className='btn btn-outline-secondary btn-sm'
                    key={status}
                    to={`/leads?status=${status}`}>
                    {status}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
        {/* QUICK ACTIONS */}
        <div className='col-lg-4'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Quick ACTIONS</h6>
              <div className='d-grid gap-2'>
                <Link to='/leads' className='btn btn-outline-primary btn-sm'>
                  View All Leads
                </Link>
                <Link to='/agents' className='btn btn-outline-secondary btn-sm'>
                  Manage Agents
                </Link>
                <Link to='/reports' className='btn btn-outline-info btn-sm'>
                  View Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { Dashboard };
