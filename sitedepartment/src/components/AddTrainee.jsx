import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddTrainee() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    access_level: "", 
    password: "",
    confirm_password: "",
    site_id: "",
    department_id: "",
    role: "Trainee"
  });

  useEffect(() => {
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
    if (name === "site_id") {
      fetchDepartmentsBySite(value);
      setFormData(prev => ({ ...prev, department_id: "", [name]: value }));
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
      role: formData.role,
      access_level: formData.access_level, // send access level
      password: formData.password,
      confirm_password: formData.confirm_password,
      site: formData.site_id,
      department: formData.department_id
    };

    try {
      await axios.post("http://localhost:8000/trainee/api/save/", dataToSend);
      alert("User registered successfully!");
      navigate('/', { state: { show: 'trainee' } });
    } catch (err) {
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Registration failed";
      alert(errorMsg);
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/', { state: { show: 'trainee' } });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add Trainee</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="form-row">
             <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div> 
            <div className="form-group">
              <label>Middle Name</label>
              <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>

          {/* Email & Access Level */}
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Access Level *</label>
              <select name="access_level" value={formData.access_level} onChange={handleChange} required>
                <option >--Select--</option>
                <option value="Level 1">Level 1</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <option value="Level 4">Level 4</option>
                <option value="Level 5">Level 5</option>
              </select>
            </div>
          </div>

          {/* Passwords */}
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
            </div>
          </div>

          {/* Site & Department */}
          <div className="form-row">
            <div className="form-group">
              <label>Site *</label>
              <select name="site_id" value={formData.site_id} onChange={handleChange} required>
                <option value="">-- Select Site --</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                required
                disabled={!formData.site_id}
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <button type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>{" "}
            &nbsp;&nbsp;
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Registering..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrainee;
