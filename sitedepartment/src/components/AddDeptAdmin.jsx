import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeptAdminTable from './DeptAdminTable';
import axios from "axios";

function AddDeptAdmin() {
  const navigate = useNavigate();
  // const [sites, setSites] = useState([]);
  // const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    access_level: "Level 4",
    password: "",
    confirm_password: "",
    role: "Dept Admin"
  });

  // useEffect(() => {
  //   axios.get("http://localhost:8000/trainee/api/sites/")
  //     .then(res => setSites(res.data))
  //     .catch(err => console.error("Error loading sites:", err));
  // }, []);

  // const fetchDepartmentsBySite = (siteId) => {
  //   if (!siteId) {
  //     setDepartments([]);
  //     return;
  //   }
    
  //   axios.get(`http://localhost:8000/trainee/api/departments/${siteId}/`)
  //     .then(res => setDepartments(res.data))
  //     .catch(err => console.error("Error loading departments:", err));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "site") {
      fetchDepartmentsBySite(value);
      setFormData(prev => ({ ...prev, department: "", [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8000/trainee/api/save/", formData);
      alert("Department Admin registered successfully!");
      navigate('/', { state: { show: 'deptAdmin' } });
    } catch (err) {
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Registration failed";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

const handleCancel = () => {
  // Navigate to HomePage and tell it to show SiteAdminTable
  navigate('/', { state: { show: 'deptAdmin' } });
};

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add Department Admin</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="middle_name">Middle Name</label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="access_level">Access Level *</label>
              <select
                id="access_level"
                name="access_level"
                value={formData.access_level}
                onChange={handleChange}
                required
              >
                <option value="Level1">Level 1</option>
                <option value="Level2">Level 2</option>
                <option value="Level3">Level 3</option>
                <option value="Level4">Level 4</option>
                <option value="Level5">Level 5</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password *</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeptAdmin;