import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; //Required to make HTTP requests

function Login() {
  const [username, setusername] = useState("");  // for username input
  const [password, setpassword] = useState("");  //for password input
  const navigate = useNavigate();               // to redirect after login

  // Function that runs when form is submitted
  const handlesubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    try {
      // Sends login data to backend (Django API)
      const result = await axios.post(
        "http://localhost:8000/users/login/", // Django login API
        { username, password },
      );

      // If login is successful
      alert(`Login Success ${username}`);
      navigate("/logout");  // Navigate to logout page
    } catch (err) {
      // If login fails
      alert("Login failed. Try again.");
      console.error(err);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handlesubmit}>
        <label htmlFor="username">Username :</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <br />

        <label htmlFor="password">Password :</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <br />

        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;
