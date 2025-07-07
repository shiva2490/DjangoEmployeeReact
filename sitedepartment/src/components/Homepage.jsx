import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import './Home.css';

import SiteAdminTable from './SiteAdminTable';
import DeptAdminTable from './DeptAdminTable';
import TraineeTable from './TraineeTable';
import SiteVedhaTable from './SiteVedhaTable';
import DeptVedhaTable from './DeptVedhaTable'; // Import the new component

function HomePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [activeTable, setActiveTable] = useState('users');

  useEffect(() => {
    const tableFromState = location.state?.show;
    if (tableFromState) {
      setActiveTable(tableFromState);  // read from navigation state
    } else {
      setActiveTable("users");         // default view
    }

    fetchUsers(); // still fetch all users for All Users table
  }, []);  //location.state

  const fetchUsers = () => {
    axios.get("http://localhost:8000/trainee/api/findall/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  };

  return (
    <div className="main-container" style={{ display: 'flex' }}>
      {/* Left - Role Buttons */}
      <div className="left-panel" style={{ width: '200px', padding: '20px' }}>
        <h3>Roles</h3>
        <button className="role-btn" onClick={() => setActiveTable('siteAdmin')}>Site Admin</button>
        <button className="role-btn" onClick={() => setActiveTable('deptAdmin')}>Dept Admin</button>
        <button className="role-btn" onClick={() => setActiveTable('trainee')}>Trainee</button>
        <button className="role-btn" onClick={() => setActiveTable('users')}>All Users</button>
        <button className="role-btn" onClick={() => setActiveTable('sitevedhatable')}>Sites</button>
        <button className="role-btn" onClick={() => setActiveTable('deptvedhatable')}>Depts</button>
      </div>

      {/* Right - Tables */}
      <div className="right-panel" style={{ flex: 1, padding: '20px' }}>
        {/* Show heading ONLY for All Users */}
        {activeTable === 'users' && (
          <>
            <div className="page-header">
              <h1>All Users</h1>
            </div>
            <div className="table-container">
              <table className="user-table" border={3}>
                <thead>
                  <tr>
                    <th>Sl.No</th>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Access Level</th>
                    <th>Site</th>
                    <th>Department</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.first_name}</td>
                      <td>{user.middle_name || "—"}</td>
                      <td>{user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.access_level}</td>
                      <td>{user.site_name || "—"}</td>
                      <td>{user.department_name || "—"}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="no-data">
                  <p>No users found. Click "Add User" to create your first user.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Other roles handle their own headings */}
        {activeTable === 'siteAdmin' && <SiteAdminTable />}
        {activeTable === 'deptAdmin' && <DeptAdminTable />}
        {activeTable === 'trainee' && <TraineeTable />}
        {activeTable === 'sitevedhatable' && <SiteVedhaTable/>}
        {activeTable === 'deptvedhatable' && <DeptVedhaTable/>}
      </div>
    </div>
  );
};

export default HomePage;