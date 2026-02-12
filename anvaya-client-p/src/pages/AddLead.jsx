import { useState } from "react";
import { useAgent } from "../contexts/AgentsContext";
import { useLead } from "../contexts/LeadContext";
import { useNavigate } from "react-router-dom";
const AddLeads = () => {
  const { agents } = useAgent();
  const { addLeads } = useLead();
  const [form, setForm] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    tags: "",
    timeToClose: "",
    priority: "",
  });
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const addTag = () => {};

  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      form;
    if (
      !name ||
      !source ||
      !salesAgent ||
      !status ||
      !tags ||
      !timeToClose ||
      !priority
    ) {
      alert("All fields is required");
      return;
    }
    const payload = {
      ...form,
      timeToClose: Number(5 + timeToClose),
      tags: tags.split(", ").map((q) => q.trim()),
    };
    await addLeads(payload);
    navigate("/", { replace: true });
  };
  return (
    <div>
      <h2>AddLeads Page</h2>
      <div>
        <form onSubmit={submitHandler}>
          <label className='form-label'>Lead Name</label>
          <input
            className='form-control'
            placeholder='enter lead name'
            value={form.name}
            onChange={handleChange}
            name='name'
            required
          />
          <label className='form-label'>Source</label>
          <select
            onChange={handleChange}
            className='form-select'
            name='source'
            value={form.source}>
            <option value='Website'>Website</option>
            <option value='Referral'>Referral</option>
            <option value='Cold Call'>Cold Call</option>
            <option value='Advertisement'>Advertisement</option>
            <option value='Email'>Email</option>
            <option value='Other'>Other</option>
          </select>
          <label className='form-label'>Sales Agent</label>
          <select
            name='salesAgent'
            onChange={handleChange}
            className='form-select'>
            <option value=''>--Select Agent ---</option>
            {agents.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name}
              </option>
            ))}
          </select>
          <label className='form-label'>Priority</label>
          <select
            name='priority'
            onChange={handleChange}
            value={form.priority}
            className='form-select'>
            <option value=''>--Select Priority--</option>
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
          </select>
          <label className='form-label'>Time to Close (days)</label>
          <input
            type='number'
            min='1'
            name='timeToClose'
            className='form-control'
            value={form.timeToClose}
            onChange={handleChange}
          />
          <label>Lead Status</label>
          <select
            name='status'
            value={form.status}
            onChange={handleChange}
            className='form-select'>
            <option value='New'>New</option>
            <option value='Contacted'>Contacted</option>
            <option value='Qualified'>Qualified</option>
            <option value='Proposal Sent'>Proposal Sent</option>
            <option value='Closed'>Closed</option>
          </select>
          <label className='form-label'>Tags</label>
          <div className='input-group mb-2'>
            <input
              className='form-control'
              placeholder='Type tag and click Add'
              name='tags'
              onChange={handleChange}
            />
            <button
              type='button'
              className='btn btn-outline-primary'
              onClick={addTag}>
              Add
            </button>
          </div>
          <button className='btn btn-outline-secondary'>Add Leads</button>
        </form>
      </div>
    </div>
  );
};
export { AddLeads };
