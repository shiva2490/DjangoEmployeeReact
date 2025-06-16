// src/components/AddUser.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    access_level: "user",
    password: "",
    confirm_password: "",
    site: "",
    department: ""
  });

  useEffect(() => {
    // Load sites on component mount
    axios.get("http://localhost:8000/trainee/api/sites/")
      .then(res => setSites(res.data))
      .catch(err => console.error("Error loading sites:", err));
  }, []);

  const fetchDepartmentsBySite = (siteId) => {
    if (!siteId) {
      setDepartments([]);
      return;
    }
    
    axios.get(`http://localhost:8000/trainee/api/departments/${siteId}/`)
      .then(res => setDepartments(res.data))
      .catch(err => console.error("Error loading departments:", err));
  };

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

    const dataToSend = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      email: formData.email,
      access_level: formData.access_level,
      password: formData.password,
      confirm_password: formData.confirm_password,
      site: formData.site,
      department: formData.department
    };

    try {
      await axios.post("http://localhost:8000/trainee/api/database/", dataToSend);
      alert("User registered successfully!");
      navigate('/'); // Navigate back to trainee table
    } catch (err) {
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Registration failed";
      alert(errorMsg);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add User</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Row 1 - Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input  class="colored-input"
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
              <input  class="colored-input"
                type="text"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input  class="colored-input"
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2 - Email and Access Level */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input  class="colored-input"
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
              <select class="colored-input"
                id="access_level"
                name="access_level"
                value={formData.access_level}
                onChange={handleChange}
                required
              >
                <option value="Level1" >Level 1</option>
                <option value="Level2">Level 2</option>
                <option value="Level3">Level 3</option>
                <option value="Level4">Level 4</option>
                <option value="Level5">Level 5</option>
              </select>
            </div>
          </div>

          {/* Row 3 - Password Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input class="colored-input"
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
              <input class="colored-input"
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 4 - Site and Department */}
          {(formData.role === "Trainee") && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="site" >Site *</label>
              <select class="colored-input"
                id="site"
                name="site"
                value={formData.site}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Site --</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" >
              <label htmlFor="department">Department *</label>
              <select class="colored-input"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={!formData.site}
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
          )}

          {/* Action Buttons */}
          <div>
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>&nbsp;&nbsp;
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;