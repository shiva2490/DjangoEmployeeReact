// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/Homepage';
import AddSiteAdmin from './components/AddSiteAdmin';
import AddDeptAdmin from './components/AddDeptAdmin';
import AddTrainee from './components/AddTrainee';
import EditUser from './components/EditUser';
import AddSiteVedha from './components/AddSiteVedha';
import EditSiteVedha from './components/EditSiteVedha';
import AddDeptVedha from './components/AddDeptVedha';
import EditDeptVedha from './components/EditDeptVedha';
import DeptVedhaTable from './components/DeptVedhaTable';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-site-admin" element={<AddSiteAdmin />} />
          <Route path="/add-dept-admin" element={<AddDeptAdmin />} />
          <Route path="/add-trainee" element={<AddTrainee />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/add-site-vedha" element={<AddSiteVedha />} />
          <Route path="/edit-site-vedha/:id" element={<EditSiteVedha />} />
          <Route path="/add-dept-vedha" element={<AddDeptVedha />} />
          <Route path="/dept-vedha-table" element={<DeptVedhaTable />} />
          <Route path="/edit-dept-vedha/:id" element={<EditDeptVedha />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
