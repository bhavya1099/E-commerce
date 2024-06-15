import React, { useContext } from "react";
import CredentialsContext from "../contexts/CredentialContext.js";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const { creds } = useContext(CredentialsContext);
  const navigate = useNavigate();
  return (
    <>
      <div style={{ textAlign: "center", fontSize: "25px", marginTop: "18px" }}>
        Welcome {creds.username}!
      </div>
      <div className="footerBtns">
        <button className="loginBtn" onClick={() => navigate("/register")}>
          Register
        </button>
        <button className="registerBtn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </>
  );
}
export default Welcome;
