import { Link } from "react-router-dom";

const LeadCard = ({ lead }) => {
  return (
    <div className='card mb-2 shadow-sm'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-start'>
          <div>
            <h6 className='card-title mb-1'>
              <Link
                style={{ textDecoration: "none" }}
                to={`/leads/${lead._id}`}>
                {lead.name}
              </Link>
            </h6>
            <small className='text-muted'>
              {new Date(lead.createdAt).toLocaleDateString()}
            </small>
          </div>
          {/* delete icon */}
          <p className='badge text-bg-danger p-2 m-2'>delete</p>
        </div>
        <p className="card-text mt-2 mb-2">
         Status: <strong>{lead.status}</strong> | Agent:{" "} {lead.salesAgent?.name || "-"}
        </p>
        <p className='card-text mb-2'>
        Priority: {lead.priority} | Time to Close {lead.timeToClose} days
        </p>
        <div>
         {lead.tags?.map((t)=>(
            <span key={t} className="badge bg-info text-dark me-1">{t}</span>
         ))}
        </div>
      </div>
    </div>
  );
};
export default LeadCard;
