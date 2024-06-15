import { React, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CredentialsContext from "../contexts/CredentialContext.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCreds, creds } = useContext(CredentialsContext);
  const [error, setError] = useState(false);
  const history = useNavigate();

  const handleErrors = async (res) => {
    console.log("response", res);
    //setError(false);
    if (!res.ok) {
      const message = await res.json();
      throw Error(message);
    }
    return res.json();
  };

  const login = (e) => {
    e.preventDefault();
    console.log("hey there");
    fetch("http://localhost:3001/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(handleErrors)
      .then((data) => {
        history("/home");
      })
      .catch((err) => {
        console.log("err message", err);
        setError(true);
        toast("User doesn't exists !");
      });
  };

  return (
    <>
      <div style={{ textAlign: "center", fontSize: "25px", marginTop: "18px" }}>
        Login
      </div>
      <ToastContainer />
      <form onSubmit={login}>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setCreds({ ...creds, email: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
            setCreds({ ...creds, password: e.target.value });
          }}
        />
        <button type="submit">Log In</button>
      </form>
      {error && (
        <div>
          <a href="/register">Register here!</a>
        </div>
      )}
      <div className="footerText">Not a member? Register here!</div>
      <div className="footerBtn">
        <button className="loginBtn" onClick={() => history("/register")}>
          Register
        </button>
      </div>
    </>
  );
}
export default Login;
