// components/GoogleLoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function GoogleLoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      navigate("/"); // redirect if already logged in
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/google-auth/', {
        credential: credentialResponse.credential,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Save tokens and user info in localStorage
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user_data", JSON.stringify(res.data.user));

      setIsLoggedIn(true);
      setUser(res.data.user);
      alert("Login successful!");
      navigate("/"); // redirect to homepage

    } catch (error) {
      console.error("Login Failed:", error.response?.data || error);
      alert("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    alert("Google login failed. Try again.");
  };

  return (
    <GoogleOAuthProvider clientId="125990407853-rr1da574go4b6j2c462aoshjuj7keum8.apps.googleusercontent.com">
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Google SSO Login</h2>
        {loading && <p>Authenticating...</p>}
        {!isLoggedIn && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            useOneTap={true}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginPage;
