/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJSON } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const LeadDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [lead, setLead] = useState(null);
  const [comment, setComment] = useState([]);
  const [agent, setAgent] = useState([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  console.log(lead);

  // Edit lead id form
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(formData);

  // Comment edit
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (id && token) {
      load();
    }
  }, [id]);

  const load = async () => {
    /* 
    try {
      const leadDetails = await fetchJSON("/leads/" + id, {}, token);
      setLead(leadDetails?.data?.leads);
      const comment = await fetchJSON("/leads/" + id + "/comments");
      setComment(comment?.data?.comments || []);
      const agentRes = await fetchJSON("/agents", {}, token);
      setAgent(agentRes?.data?.agents);
    } catch (error) {
      console.error(error.message);
    } */
    try {
      const [leadRes, commentRes, agentRes] = await Promise.all([
        fetchJSON(`/leads/${id}`, {}, token),
        fetchJSON(`/leads/${id}/comments`, {}, token),
        fetchJSON("/agents", {}, token),
      ]);

      setLead(leadRes?.data?.leads);
      setComment(commentRes?.data?.comments || []);
      setAgent(agentRes?.data?.agents || []);
    } catch (err) {
      console.error(err.message);
    }
  };
  const addComment = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        author,
        commentText: text,
      };
      await fetchJSON(
        "/leads/" + id + "/comments",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token,
      );
      setText("");
      setAuthor("");
      load();
      toast.success("Comment added successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to add comment");
    }
  };
  // comment edit
  const saveEdit = async () => {
    try {
      await fetchJSON(
        "/leads/comments/" + editing.id,
        {
          method: "PUT",
          body: JSON.stringify({ commentText: editing.text }),
        },
        token,
      );
      setEditing(null);
      load();
      toast.success("comment updated");
    } catch (error) {
      toast.error("Failed to edit text");
    }
  };

  // EDIT LEAD
  const openEditModal = () => {
    setFormData(lead);
    setShowEdit(true);
  };
  //
  const handleUpdate = async () => {
    try {
      // OPTIONAL PAYLOAD Either send this or directly form 
      const payload = {
        status: formData.status,
        priority: formData.priority,
        source: formData.source,
        timeToClose: Number(formData.timeToClose),
        salesAgent:
          typeof formData.salesAgent === "object"
            ? formData.salesAgent._id
            : formData.salesAgent,
        tags: formData.tags || [],
      };
      await fetchJSON(
        `/leads/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        token,
      );
      setShowEdit(false);
      load();
      toast.success("Comment Updated");
    } catch (error) {
      toast.error("Updare failed");
    }
  };
  return (
    <div className=''>
      <div className='d-flex justify-content-between align-items-center'>
        <h2>{lead?.name}</h2>
        <div>
          <select className='form-select'>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Proposal Sent</option>
            <option>Closed</option>
          </select>
        </div>
      </div>
      <p>Agent: {lead?.salesAgent?.name}</p>
      <p>
        <strong>Status:</strong> {lead?.status}
      </p>
      <p>Source: {lead?.source}</p>
      <p>Priority: {lead?.priority}</p>
      <p>
        <strong>Time to Close:</strong> {lead?.timeToClose} Days
      </p>
      <p>
        <strong>Tags:</strong> {lead?.tags?.join(", ")}
      </p>
      <button className='btn btn-primary mt-2' onClick={openEditModal}>
        Edit Lead Details
      </button>

      <hr />
      {/* COMMENTS */}
      <h5>Comments</h5>
      <form onSubmit={addComment}>
        <div className='mb-2'>
          <select
            className='form-select'
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={agent.length === 0}>
            <option value=''>
              {agent.length === 0 ? "Loading agents" : "Select author"}
            </option>
            {agent.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
          {agent.length === 0 && (
            <small className='text-muted'>
              No agents available for this lead
            </small>
          )}
        </div>
        <div className='mb-2'>
          <textarea
            className='form-control'
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button className='btn btn-sm btn-primary' disabled={!author || !text}>
          Add Comment
        </button>
      </form>
      {comment.length === 0 && <p className='text-muted'>No comments ye.</p>}
      <div className='mt-3'>
        {comment.map((comment) => (
          <div key={comment._id} className='border p-2 mb-2'>
            <strong>{comment.author?.name}</strong>{" "}
            <small className='text-muted'>
              {new Date(comment.createdAt).toLocaleString()}
            </small>
            {editing?.id === comment._id ? (
              <>
                <textarea
                  className='form-control my-2'
                  value={editing.text}
                  onChange={(e) =>
                    setEditing({ ...editing, text: e.target.value })
                  }
                />

                <button
                  className='btn btn-sm btn-success me-2'
                  onClick={saveEdit}>
                  Save
                </button>

                <button
                  className='btn btn-sm btn-secondary'
                  onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>{comment.commentText}</p>

                <button
                  className='btn btn-sm btn-link'
                  onClick={() =>
                    setEditing({
                      id: comment._id,
                      text: comment.commentText,
                    })
                  }>
                  Edit 📝
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {showEdit && (
        <div className='modal d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Edit Lead</h5>
                <button
                  className='btn-close'
                  onClick={() => setShowEdit(false)}
                />
              </div>

              <div className='modal-body'>
                {/* STATUS */}
                <label>Status</label>
                <select
                  className='form-control mb-3'
                  value={formData.status || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }>
                  <option value=''>Select Status</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Proposal Sent</option>
                  <option>Closed</option>
                </select>

                {/* PRIORITY */}
                <label>Priority</label>
                <select
                  className='form-control mb-3'
                  value={formData.priority || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }>
                  <option value=''>Select Priority</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                {/* SOURCE */}
                <label>Source</label>
                <select
                  className='form-control mb-3'
                  value={formData.source || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }>
                  <option value=''>Select Source</option>
                  <option>Website</option>
                  <option>Referral</option>
                  <option>Cold Call</option>
                  <option>Advertisement</option>
                  <option>Email</option>
                  <option>Other</option>
                </select>

                {/* TIME TO CLOSE */}
                <label>Time To Close (Days)</label>
                <input
                  type='number'
                  className='form-control mb-3'
                  value={formData.timeToClose || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeToClose: parseInt(e.target.value),
                    })
                  }
                />

                {/* SALES AGENT */}
                <label>Assign Sales Agent</label>
                <select
                  className='form-control mb-3'
                  value={formData.salesAgent?._id || formData.salesAgent || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salesAgent: e.target.value,
                    })
                  }>
                  <option value=''>Select Agent</option>
                  {agent.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>

                {/* TAGS */}
                <label>Tags (comma separated)</label>
                <input
                  type='text'
                  className='form-control'
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                />
              </div>

              <div className='modal-footer'>
                <button
                  className='btn btn-secondary'
                  onClick={() => setShowEdit(false)}>
                  Cancel
                </button>

                <button className='btn btn-success' onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export { LeadDetails };
