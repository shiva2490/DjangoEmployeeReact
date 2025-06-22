import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
// import SiteAdminTable from './components/SiteAdminTable';
// import DeptAdminTable from './components/DeptAdminTable';
// import TraineeTable from './components/TraineeTable';
import AddSiteAdmin from './components/AddSiteAdmin';
import AddDeptAdmin from './components/AddDeptAdmin';
import AddTrainee from './components/AddTrainee';
import EditUser from './components/EditUser';
// import AddUser from './components/AddUser';
import './App.css';
import AddSiteVedha from './components/AddSiteVedha';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/site-admin" element={<SiteAdminTable />} />
          <Route path="/dept-admin" element={<DeptAdminTable />} />
          <Route path="/trainee" element={<TraineeTable />} /> */}
          <Route path="/add-site-admin" element={<AddSiteAdmin />} />
          <Route path="/add-dept-admin" element={<AddDeptAdmin />} />
          <Route path="/add-trainee" element={<AddTrainee />} />
          {/* <Route path="/add-user" element={<AddUser />} /> */}
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/savesitevedha" element={<AddSiteVedha />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;