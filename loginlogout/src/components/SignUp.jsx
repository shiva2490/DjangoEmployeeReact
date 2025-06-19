import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation only
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const { confirm_password, ...dataToSend } = formData; // remove confirm_password
      const res = await axios.post("http://localhost:8000/users/signup/", dataToSend);
      setSuccess(res.data.message);
      setError('');
      navigate("/")
    // } catch (err) {
    //   const errMsg = err.response?.data?.message || "Signup failed";
    //   setError(errMsg);
    // }
    } catch (err) {
    if (err.response && err.response.data) {
    const data = err.response.data;
    // Get first field name (like "username" or "email")
    const firstField = Object.keys(data)[0];
    // Get first error message from that field
    const firstError = data[firstField][0];
    setError(firstError);  // Show the error on screen
  } else {
    setError("Signup failed"); // Default error
  } 
  };
  }
  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" required onChange={handleChange} /><br />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} /><br />
        <input name="confirm_password" type="password" placeholder="Confirm Password" required onChange={handleChange} /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignUp;
