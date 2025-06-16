import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // optional if you're using custom styles

const HomePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:8000/trainee/api/findall/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:8000/trainee/api/delete/${id}/`)
        .then(() => {
          alert("User deleted successfully");
          fetchUsers(); // refresh list
        })
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`, { state: { user } });
  };


  return (
    <div className="main-container" style={{ display: 'flex' }}>
      {/* Left Side - Role Buttons */}
      <div className="left-panel" style={{ width: '200px', padding: '20px' }}>
        <h3>Roles</h3>
        <button className="role-btn site-admin" onClick={() => navigate('/site-admin')}>
          Site Admin
        </button>
        <button className="role-btn dept-admin" onClick={() => navigate('/dept-admin')}>
          Department Admin
        </button>
        <button className="role-btn trainee" onClick={() => navigate('/trainee')}>
          Trainee
        </button>
      </div>

      {/* Right Side - User Table */}
      <div className="right-panel" style={{ flex: 1, padding: '20px' }}>
        <div className="page-header">
          <h1>Users</h1>
          {/* <button className="add-user-btn" onClick={handleAddUser}>
            Add User
          </button> */}
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
                <th>Actions</th>
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
                  <td>
                    <span className={`access-badge ${user.access_level}`}>
                      {user.access_level}
                    </span>
                  </td>
                  <td>{user.site_name || "—"}</td>
                  <td>{user.department_name || "—"}</td>
                  <td>{user.role}</td>
                  <td className="action-cell">
                    <button className="btn btn-edit" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
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
      </div>
    </div>
  );
};

export default HomePage;
