import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Logout() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/users/logout/",
        {},
        // { withCredentials: true }  // Important to send session cookie
      );

      alert("Logged out successfully!");
      navigate("/");
    } catch (err) {
      alert("Logout failed!");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Logout Page</h2>
      <button type="button" onClick={handleLogout}>Logout</button>
    </div>
  );

}
export default Logout;