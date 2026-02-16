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

  // Edit lead id form 
  const [showEdit,setShowEdit] = useState(false)

  // Comment edit 
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

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
      <p>Source: {lead?.source}</p>
      <p>Priority: {lead?.priority}</p>

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
    </div>
  );
};
export { LeadDetails };
