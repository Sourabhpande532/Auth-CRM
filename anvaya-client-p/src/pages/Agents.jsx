import { useEffect, useState } from "react";
import { useAgent } from "../contexts/AgentsContext";
import { useFetch } from "../userFetch";
import { url } from "../api";
import { useAuth } from "../contexts/AuthContext";

const Agents = () => {
  const { addAgents, updateAgent } = useAgent();
  const [agents, setAgents] = useState([]);
  const { token } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState();
  useEffect(() => {
    loadAgents();
  }, []);
  const loadAgents = async () => {
    try {
      const headers = {
        "Content-type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`${url}/agents`, { headers });
      const result = await response.json();
      setAgents(result.data.agents);
    } catch (error) {
      console.error(error);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAgent(editId,form);
        loadAgents()
      } else {
        await addAgents(form);
        loadAgents();
        setForm({ name: "", email: "" });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onEdit = (a) => {
    setEditId(a._id);
    setForm({
      name: a.name,
      email: a.email,
    });
  };
  return (
    <div className='container-fluid'>
      <h2>Agents Page</h2>
      <div className='row g-3'>
        <div className='col-xl-6 col-lg-7 col-md-12 mb-4'>
          <form onSubmit={submitHandler}>
            <input
              placeholder='Agent name'
              className='form-control'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder='Agent email'
              className='form-control'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <button className='btn w-100 btn-lg btn-primary'>Add</button>
          </form>
        </div>
        <div className=''>
          {agents.length === 0 ? (
            <p className='text-muted'>No Agents added yet.</p>
          ) : (
            <ul className=''>
              {agents.map((a) => (
                <li key={a._id}>
                  <div>
                    <div>{a.name}</div>
                    <div>{a.email}</div>
                    <button onClick={() => onEdit(a)}>Edit</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
export { Agents };
