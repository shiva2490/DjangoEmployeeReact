import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function AddSiteVedha() {
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
    axios
      .get("http://localhost:8000/trainee/api/site_admin_emails/")
      .then((res) => setSiteAdmins(res.data))
      .catch(() => setMessage("Failed to load site admins"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSimulationsChange = (event, value) => {
    // value is an array of selected simulation objects
    const selected = value.map(item => item.title);
    setFormData((prev) => ({ ...prev, simulations: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.site_name || !formData.location || !formData.site_admin) {
      setMessage("Site name, location, and site admin are required.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/trainee/api/savesitevedha/", formData);
      setMessage("SiteVedha added successfully!");
      setTimeout(() => {
        navigate("/", { state: { show: "sitevedhatable" } });
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to save site.");
    }
  };

  const handleCancel = () => {
    navigate("/", { state: { show: "sitevedhatable" } });
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Add Site</h2>
        {message && <p style={{ color: "red" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* First Row: Site name and Location */}
          <div className="form-row">
            <div className="form-group">
              <label>Site Name</label>
              <input type="text" name="site_name" value={formData.site_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>
          </div>

          {/* Second Row: Simulations and Site Admin */}
          <div className="form-row">
            <div className="form-group">
              <label>Simulations</label>
              <Autocomplete
                multiple
                id="simulations-autocomplete"
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
                value={simulationOptions.filter(opt => formData.simulations.includes(opt.title))}
                renderInput={(params) => (
                  <TextField {...params}/>
                )}
              />
            </div>

            <div className="form-group">
              <label>Site Admin</label>
              <select
                name="site_admin"
                value={formData.site_admin}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Site Admin --</option>
                {siteAdmins.map((admin) => (
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
              Save SiteVedha
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

export default AddSiteVedha;