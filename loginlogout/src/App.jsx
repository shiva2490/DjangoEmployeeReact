  // src/App.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './components/Login';
import Logout from './components/Logout';
import SignUp from './components/SignUp';

function App() {

  //   useEffect(() => {
  //   axios.get("http://localhost:8000/csrf/", {
  //     withCredentials: true,
  //   })
  //   .then(() => {
  //     console.log("CSRF cookie set!");
  //   })
  //   .catch(err => {
  //     console.error("CSRF fetch failed:", err);
  //   });
  // }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </Router>
  );
}
export default App;