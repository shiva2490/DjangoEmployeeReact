import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));  //Converts JSON string (from backend) back to JS object
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    
    try {
      // Use the custom endpoint
      const res = await axios.post('http://127.0.0.1:8000/api/google-auth/', {
        credential: credentialResponse.credential,  // This is the Google JWT token
      }, {
        headers: {
          'Content-Type': 'application/json',   //Tells Django this is a JSON request (required!)
        }
      });

      alert("Login Success:", res.data);   
      
      // Store tokens and user data
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user_data", JSON.stringify(res.data.user));  //	stringify => Converts JS object to string for localStorage
      
      setIsLoggedIn(true);
      setUser(res.data.user);   //res.data.user =>	Contains user's name, email, id
      
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    alert("Google login failed. Please try again.");
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    
    setIsLoggedIn(false);   // view → back to "Login" view
    setUser(null);    // This removes the user object from memory. Because there is no user now
    alert("Logged out successfully.");
  };

  return (
    <GoogleOAuthProvider clientId="125990407853-rr1da574go4b6j2c462aoshjuj7keum8.apps.googleusercontent.com">  
      <div style={{ 
        // marginTop: "50px", 
         textAlign: "center", 
        // padding: "20px",
        // maxWidth: "400px",
        // margin: "50px auto",
        // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px"
      }}>
        <h2>Google SSO Login</h2>
        
        {loading && <p>Authenticating...</p>}
        
        {!isLoggedIn ? (
          <div>
            <p>Sign in with your Google account</p>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap={true}
              auto_select={false}
            />
          </div>
        ) : (
          <div>
            <h3>Welcome!</h3>
            {user && (
              <div style={{ margin: "20px 0" }}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            )}
            <button 
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;