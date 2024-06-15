import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CredentialsContext from "../contexts/CredentialContext.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { creds, setCreds } = useContext(CredentialsContext);
  const history = useNavigate();

  const handleErrors = async (res) => {
    console.log("response", res);
    if (!res.ok) {
      const message = await res.json();
      throw Error(message);
    }
    return res.json();
  };

  const register = (e) => {
    e.preventDefault();
    console.log("hey there");

    fetch("http://localhost:3001/api/v1/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        name: name,
      }),
    })
      .then((res) => {
        return handleErrors(res);
      })
      .then(() => {
        history("/home");
      })
      .catch((err) => {
        console.log("err message", err);
        toast("User already exists !");
      });
  };

  return (
    <>
      <div style={{ textAlign: "center", fontSize: "25px", marginTop: "18px" }}>
        Sign Up!
      </div>
      <ToastContainer />
      <form onSubmit={register}>
        <input
          type="name"
          placeholder="name"
          onChange={(e) => {
            setName(e.target.value);
            setCreds({ ...creds, name: e.target.value });
          }}
        />
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
        <input
          type="password"
          placeholder="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setCreds({ ...creds, confirmPassword: e.target.value });
          }}
        />

        <button type="submit">Sign Up</button>
      </form>

      <div className="footerText">Already a member, Login here!</div>
      <div className="footerBtn">
        <button className="loginBtn" onClick={() => history("/login")}>
          Login
        </button>
      </div>
    </>
  );
}
export default Register;
