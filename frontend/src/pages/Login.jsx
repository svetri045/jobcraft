import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const result = await login(
      loginEmail,
      loginPassword
    );

    if (result.success) {
      alert("Logged in successfully!");
      navigate("/jobs");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="loginPageWrapper">
      <div className="loginPageCard">
        <h2 className="loginPageTitle">
          🔐 Login
        </h2>

        <form onSubmit={handleLoginSubmit}>
          <div className="loginPageInputGroup">
            <label>
              Email Address
            </label>

            <input
              type="email"
              value={loginEmail}
              onChange={(event) =>
                setLoginEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="loginPageInputGroup">
            <label>
              Password
            </label>

            <input
              type="password"
              value={loginPassword}
              onChange={(event) =>
                setLoginPassword(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="loginPageSubmitButton"
          >
            Login Now
          </button>
        </form>

        <div className="loginPageRegisterLink">
          Don't have an account?

          <span
            onClick={() =>
              navigate("/register")
            }
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;