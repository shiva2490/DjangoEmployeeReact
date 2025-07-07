import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function AddDeptVedha() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dept_name: "",
    location: "",
    site: "",
    dept_admin: ""
  });

  const [siteVedhas, setSiteVedhas] = useState([]);
  const [deptAdmins, setDeptAdmins] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load site vedhas
    axios
      .get("http://localhost:8000/trainee/api/site-vedha-names/")
      .then((res) => setSiteVedhas(res.data))
      .catch(() => setMessage("Failed to load sites"));

    // Load dept admins
    axios
      .get("http://localhost:8000/trainee/api/dept-admin-emails/")
      .then((res) => setDeptAdmins(res.data))
      .catch(() => setMessage("Failed to load dept admins"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dept_name || !formData.location || !formData.site || !formData.dept_admin) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/trainee/api/savedeptvedha/", formData);
      setMessage("DeptVedha added successfully!");
      setTimeout(() => {
        // Navigate to home page with state to show dept vedha table
        navigate("/", { state: { show: "deptvedhatable" } });
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to save department.");
    }
  };

  const handleCancel = () => {
    // Navigate to home page with state to show dept vedha table
    navigate("/", { state: { show: "deptvedhatable" } });
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Add Department</h2>
        {message && <p style={{ color: "red" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* First Row: Dept name and Location */}
          <div className="form-row">
            <div className="form-group">
              <label>Department Name</label>
              <input 
                type="text" 
                name="dept_name" 
                value={formData.dept_name} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Second Row: Site and Dept Admin */}
          <div className="form-row">
            <div className="form-group">
              <label>Site</label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
              >
                <option value="">-- Select Site --</option>
                {siteVedhas.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.site_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Department Admin</label>
              <select
                name="dept_admin"
                value={formData.dept_admin}
                onChange={handleChange}
              >
                <option value="">-- Select Dept Admin --</option>
                {deptAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Third Row: Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Dept
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDeptVedha;