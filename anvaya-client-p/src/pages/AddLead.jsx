import { useState } from "react";
import { useAgent } from "../contexts/AgentsContext";

const AddLeads = () => {
  const { agents } = useAgent();
  const [form, setForm] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    tags: "",
    timeToClose: "",
    priority: "",
  });
  console.log(agents);

  const handleChange = () => {};
  return (
    <div>
      <h2>AddLeads Page</h2>
      <div>
        <form>
          <label>Lead Name</label>
          <input
            className='form-control'
            placeholder='enter lead name'
            value={form.name}
            onChange={handleChange}
          />
          <label>Source</label>
          <select onChange={handleChange} className='form-control'>
            <option value='Website'>Website</option>
            <option value='Referral'>Referral</option>
            <option value='Cold Call'>Cold Call</option>
            <option value='Advertisement'>Advertisement</option>
            <option value='Email'>Email</option>
            <option value='Other'>Other</option>
          </select>
          <label>Sales Agent</label>
        </form>
      </div>
    </div>
  );
};
export { AddLeads };
