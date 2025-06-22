import React, { useState, useEffect } from "react";
import axios from "axios";

function AddSiteVedha() {
  const [formData, setFormData] = useState({
    site_name: "",
    location: "",
    simulations: [],
    site_admin: ""
  });

  const [siteAdmins, setSiteAdmins] = useState([]);

  // Hardcoded simulation options
  const simulationOptions = [
    "Electricity",
    "Water Flow",
    "Traffic Control",
    "Elevator",
    "Fire Safety"
  ];

  useEffect(() => {
    axios.get("http://localhost:8000/trainee/api/site-admin-emails/").then((res) => {
      setSiteAdmins(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulationsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, simulations: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/trainee/api/savesitevedha/", formData);
      alert("SiteVedha saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error: " + JSON.stringify(err.response.data));
    }
  };

  return (
    <div>
      <h2>Add SiteVedha</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Site Name *</label><br />
          <input
            type="text"
            name="site_name"
            value={formData.site_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Location *</label><br />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Simulations (select multiple)</label><br />
          <select multiple name="simulations" onChange={handleSimulationsChange}>
            {simulationOptions.map((sim, idx) => (
              <option key={idx} value={sim}>{sim}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Site Admin (from DB)</label><br />
          <select name="site_admin" onChange={handleChange} value={formData.site_admin} required>
            <option value="">--Select Admin--</option>
            {siteAdmins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.email}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default AddSiteVedha;
