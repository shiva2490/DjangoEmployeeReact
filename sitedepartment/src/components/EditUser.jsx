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
  const [userRole, setUserRole] = useState("");

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
    role: ""
  });

  useEffect(() => {
    axios.get("http://localhost:8000/trainee/api/sites/")
      .then(res => setSites(res.data))
      .catch(err => console.error("Error loading sites:", err));

    if (location.state?.user) {
      const user = location.state.user;

      setUserRole(user.role);
      setFormData({
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        access_level: user.access_level || "",
        password: "",
        confirm_password: "",
        site_id: user.site || "",
        department_id: user.department || "",
        role: user.role || ""
      });

      if (user.site) {
        fetchDepartmentsBySite(user.site);
      }
    }
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

    if (!formData.access_level) {
      alert("Select an access level");
      return;
    }

    const isPasswordProvided = formData.password || formData.confirm_password;

    if (isPasswordProvided) {
      if (formData.password !== formData.confirm_password) {
        alert("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        alert("Password required minimum 6 characters");
        return;
      }
    }

    setLoading(true);

    const dataToSend = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      email: formData.email,
      access_level: formData.access_level,
      role: formData.role
    };

    if (formData.role === "Trainee") {
      dataToSend.site = formData.site_id;
      dataToSend.department = formData.department_id;
    }

    if (isPasswordProvided) {
      dataToSend.password = formData.password;
      dataToSend.confirm_password = formData.confirm_password;
    }

    try {
      await axios.put(`http://localhost:8000/trainee/api/update/${id}/`, dataToSend);
      alert("User updated successfully!");

      const target = formData.role === "Site Admin" ? 'siteAdmin' : formData.role === "Dept Admin" ? 'deptAdmin' : 'trainee';
      navigate('/', { state: { show: target } });

    } catch (err) {
      const errorData = err.response?.data;
      let message = "Update failed";

      if (errorData) {
        if (typeof errorData === 'string' && errorData.toLowerCase().includes('email')) {
          message = "Email already exists";
        } else if (typeof errorData === 'object') {
          const emailError = errorData.email;
          if (emailError && Array.isArray(emailError) && emailError.some(e => e.toLowerCase().includes('email'))) {
            message = "Email already exists";
          } else {
            message = Object.values(errorData).flat().join("\n");
          }
        }
      } else {
        message = err.message || message;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.role === "Site Admin") navigate('/', { state: { show: 'siteAdmin' } });
    else if (formData.role === "Dept Admin") navigate('/', { state: { show: 'deptAdmin' } });
    else navigate('/', { state: { show: 'trainee' } });
  };

  // Get page title based on role
  const getTitle = () => {
    if (formData.role === "Site Admin") return "Edit Site Admin";
    if (formData.role === "Dept Admin") return "Edit Department Admin";
    return "Edit Trainee";
  };
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
                {/* <option value="">-- Select Access Level --</option> */}
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

          {/* Site/Department Fields - Trainee Only */}
          {(formData.role === "Trainee") && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="site_id">Site *</label>
                <select
                  id="site_id"
                  name="site_id"
                  value={formData.site_id}
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
                <label htmlFor="department_id">Department *</label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  disabled={!formData.site_id}
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
}

export default EditUser;
