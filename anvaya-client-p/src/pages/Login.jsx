import { useState } from "react";
import { url } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleLogin = async (e) => {
    if (!email || !password) return alert("Please filled neccessory fields");
    e.preventDefault();
    try {
      const response = await fetch(`${url}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      login(data.token);
      navigate("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div>
      <form>
        <div class='form-group'>
          <label for='exampleInputEmail1'>Email address</label>
          <input
            type='email'
            class='form-control'
            id='exampleInputEmail1'
            aria-describedby='emailHelp'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small id='emailHelp' class='form-text text-muted'>
            We'll never share your email with anyone else.
          </small>
        </div>
        <div class='form-group'>
          <label for='exampleInputPassword1'>Password</label>
          <input
            type='password'
            class='form-control'
            id='exampleInputPassword1'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div class='form-group form-check'>
          <input type='checkbox' class='form-check-input' id='exampleCheck1' />
          <label class='form-check-label' for='exampleCheck1'>
            Check me out
          </label>
        </div>
        <button onClick={handleLogin} type='submit' class='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );
};
export { Login };
