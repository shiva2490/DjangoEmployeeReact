import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function EditSiteVedha() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    site_name: "",
    location: "",
    simulations: [],
    site_admin: ""
  });

  const [siteAdmins, setSiteAdmins] = useState([]);
  const [message, setMessage] = useState("");

  const simulationOptions = [
    { title: 'Simulation 1' },
    { title: 'Simulation 2' },
    { title: 'Simulation 3' },
    { title: 'Simulation 4' },
    { title: 'Simulation 5' },
  ];

  useEffect(() => {
    // Load existing site data - MAKE SURE THIS ENDPOINT MATCHES YOUR BACKEND
    axios.get(`http://localhost:8000/trainee/api/get_site_vedha/${id}/`)
      .then((res) => {
        console.log("Site data loaded:", res.data); // Add this for debugging
        setFormData(res.data);
      })
      .catch((error) => {
        console.error("Error loading site data:", error); // Add this for debugging
        setMessage("Failed to load site details");
      });

    // Load site admins
    axios.get("http://localhost:8000/trainee/api/site_admin_emails/")
      .then((res) => {
        console.log("Sites loaded:", res.data); // Add this for debugging
        setSiteAdmins(res.data);
      })
      .catch((error) => {
        console.error("Error loading sites :", error); // Add this for debugging
        setMessage("Failed to load sites ");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSimulationsChange = (event, value) => {
    const selected = value.map(item => item.title);
    setFormData((prev) => ({ ...prev, simulations: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // MAKE SURE THIS ENDPOINT MATCHES YOUR BACKEND
      await axios.put(`http://localhost:8000/trainee/api/update_sitevedha/${id}/`, formData);
      setMessage("SiteVedha updated successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Error updating site:", error);
      setMessage("Failed to update site.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Edit Site</h2>
        {message && <p style={{ color: "red" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label>Site Name</label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name}
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

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label>Simulations</label>
              <Autocomplete
                multiple
                options={simulationOptions}
                disableCloseOnSelect
                getOptionLabel={(option) => option.title}
                onChange={handleSimulationsChange}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                value={simulationOptions.filter(opt =>
                  formData.simulations.includes(opt.title)
                )}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>

            <div className="form-group">
              <label>Site Admin</label>
              <select
                name="site_admin"
                value={formData.site_admin}
                onChange={handleChange}
              >
                <option value="">-- Select Site --</option>
                {siteAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Update Site
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSiteVedha;