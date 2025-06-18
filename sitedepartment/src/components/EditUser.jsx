import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [sites, setSites] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    access_level: "",
    password: "",
    confirm_password: "",
    site: "",
    department: "",
    role: ""
  });

  useEffect(() => {
    // Load sites for Dept Admin and Trainee
    axios.get("http://localhost:8000/trainee/api/sites/")
      .then(res => setSites(res.data))
      .catch(err => console.error("Error loading sites:", err));

    // Check if user data was passed in state
    if (location.state?.user) {
      const user = location.state.user;
      const role = location.state.role;
      
      setUserRole(role);
      setFormData({
        first_name: user.first_name,
        middle_name: user.middle_name || "",
        last_name: user.last_name,
        email: user.email,
        access_level: user.access_level,
        password: "",
        confirm_password: "",
        site: user.site_id || "",
        department: user.department_id || "",
        role: user.role
      });

      if (user.site_id) {
        fetchDepartmentsBySite(user.site_id);
      }
      setUserLoading(false);
    } else {
      // Fetch user by ID
      fetchUserById(id);
    }
  }, [id, location.state]);

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/trainee/api/user/${userId}/`);
      const user = response.data;
      
      // Determine role for UI and conditional rendering
      const role = user.role.toLowerCase().replace(' ', '-');
      setUserRole(role);
      
      setFormData({
        first_name: user.first_name,
        middle_name: user.middle_name || "",
        last_name: user.last_name,
        email: user.email,
        access_level: user.access_level,
        password: "",
        confirm_password: "",
        site: user.site_id || "",
        department: user.department_id || "",
        role: user.role
      });

      if (user.site_id) {
        fetchDepartmentsBySite(user.site_id);
      }
    } catch (err) {
      console.error("Error loading user:", err);
      alert("Error loading user data");
      
      // Redirect to appropriate page based on role
      if (userRole === "site-admin") navigate('/site-admin');
      else if (userRole === "dept-admin") navigate('/dept-admin');
      else navigate('/trainee');
    } finally {
      setUserLoading(false);
    }
  };

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
    
    // Only validate passwords if at least one is filled
    const isPasswordProvided = formData.password || formData.confirm_password;
    if (isPasswordProvided && formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    // Prepare data to send
    const dataToSend = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      email: formData.email,
      access_level: formData.access_level,
      role: formData.role
    };

    // Add site/department if applicable
    if (formData.role === "Dept Admin" || formData.role === "Trainee") {
      dataToSend.site = formData.site;
      dataToSend.department = formData.department;
    }

    // Add passwords if provided
    if (isPasswordProvided) {
      dataToSend.password = formData.password;
      dataToSend.confirm_password = formData.confirm_password;
    }

    try {
      await axios.put(`http://localhost:8000/trainee/api/update/${id}/`, dataToSend);
      alert("User updated successfully!");
      
      // Redirect to appropriate table
      if (formData.role === "Site Admin") navigate('/site-admin');
      else if (formData.role === "Dept Admin") navigate('/dept-admin');
      else navigate('/trainee');
    } catch (err) {
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Update failed";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.role === "Site Admin") navigate('/site-admin');
    else if (formData.role === "Dept Admin") navigate('/dept-admin');
    else navigate('/trainee');
  };

  // Get page title based on role
  const getTitle = () => {
    if (formData.role === "Site Admin") return "Edit Site Admin";
    if (formData.role === "Dept Admin") return "Edit Department Admin";
    return "Edit Trainee";
  };

  if (userLoading) {
    return (
      <div className="page-container">
        <div className="loading">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{getTitle()}</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Name Fields - All Roles */}
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
                className="colored-input"
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
                className="colored-input"
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
                className="colored-input"
              />
            </div>
          </div>

          {/* Email and Access Level - All Roles */}
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
                className="colored-input"
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
                className="colored-input"
              >
                <option value="Level1">Level 1</option>
                <option value="Level2">Level 2</option>
                <option value="Level3">Level 3</option>
                <option value="Level4">Level 4</option>
                <option value="Level5">Level 5</option>
              </select>
            </div>
          </div>

          {/* Password Fields - All Roles */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="colored-input"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="colored-input"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          {/* Site/Department Fields - Trainee */}
          {(formData.role === "Trainee") && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="site">Site *</label>
                <select
                  id="site"
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                  required
                  className="colored-input"
                >
                  <option value="">-- Select Site --</option>
                  {sites.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  disabled={!formData.site}
                  className="colored-input"
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
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;