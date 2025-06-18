  // src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './components/login';
import Logout from './components/logout';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}
export default App;