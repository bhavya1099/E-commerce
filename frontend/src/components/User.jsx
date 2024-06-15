import React, { useEffect, useState, useContext } from "react";
import CredentialsContext from "../contexts/CredentialContext.js";

function User() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { creds, setCreds } = useContext(CredentialsContext);
  console.log("User creds", creds);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await fetch(
          // `http://localhost:3001/api/v1/user${id}`
          "https://jsonplaceholder.typicode.com/users/1"
        );
        const user = await resp.json();
        console.log("user", user);
        setUser(user);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    })();
  }, []);

  const heading = <h2>User Example</h2>;

  if (loading) {
    return (
      <>
        {" "}
        {heading}
        <h3>...Loading</h3>
      </>
    );
  }
  //if error
  if (error) {
    return (
      <>
        {" "}
        {heading}
        <h3>Error occurred</h3>
      </>
    );
  }
  return (
    <>
      {heading}
      <h4>Name: {user.name}</h4>
      <h4>Phone: {user.phone}</h4>
    </>
  );
}

export default User;
