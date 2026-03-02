import { Link } from "react-router-dom";
import { url } from "../api";
import { useLead } from "../contexts/LeadContext";
import { useFetch } from "../userFetch";
const Dashboard = () => {
  const { data, error } = useFetch(`${url}/admin/main`);
  const { leads } = useLead();
  const modifyLeads = leads.slice(5);
  const updateLeads = modifyLeads.map((l) => ({
    ...l,
    label: l.status === "New" ? "25% Off" : "No Offer",
  }));
  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading..</p>;
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
      </div>
    </div>
  );
};
export { Dashboard };
