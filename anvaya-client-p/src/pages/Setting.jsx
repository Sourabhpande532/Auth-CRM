import { useAgent } from "../contexts/AgentsContext";
import { useLead } from "../contexts/LeadContext";

const Setting = () => {
  const { leads } = useLead();
  const { agents } = useAgent();
  console.log(leads);
  console.log(agents);

  return (
    <div>
      <h2>Setting Page</h2>
      <div className='row g-4'>
        {/* LEADS LIST */}
        <div className='col-12 col-lg-6'>
          <div className='card shadow-sm h-100'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Leads</h6>
              {leads.length === 0 ? (
                <p className='text-muted small'>No Leads found.</p>
              ) : (
                <ul className='list-group list-group-flush'>
                  {leads.map((lead) => (
                    <li
                      key={lead._id}
                      className='list-group-item d-flex justify-content-between align-items-center'>
                      <div>
                        <div className='fw-semibold'>{lead.name}</div>
                        <div className='small text-muted'>
                          Status: {lead.status}
                        </div>
                      </div>
                      <button className='btn btn-sm btn-outline-danger'>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Sales agent list */}
        <div className='col-12 col-lg-6'>
          <div className='card shadow-sm h-100'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Sales Agents</h6>
              {agents.length === 0 ? (
                <p className='text-muted small'>No agents found.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {agents.map((agent) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                     <div className="fw-semibold">{agent.name}</div>
                     <div className="small text-muted">{agent.email}</div>
                    </div>
                      <button className='btn btn-sm btn-outline-danger'>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { Setting };
