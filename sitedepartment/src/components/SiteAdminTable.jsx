import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SiteAdminTable() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:8000/trainee/api/find/Site Admin/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:8000/trainee/api/delete/${id}/`)
        .then(() => {
          alert("User deleted successfully");
          fetchUsers();
        })
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`, { state: { user, role: 'site-admin' } });
  };

  const handleAddUser = () => {
    navigate('/add-site-admin');
  };

  return (
    <div className="page-container" >
      <div className="page-header">
        <h1>Site Admins</h1>
        <button className="add-user-btn" onClick={handleAddUser}>
          Add Site Admin
        </button>
      </div>
      
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Access Level</th>
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
                <td className="action-cell">
                  <button 
                    className="btn btn-edit" 
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="no-data">
            <p>No site admins found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteAdminTable;