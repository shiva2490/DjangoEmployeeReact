import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DeptVedhaTable() {
  const navigate = useNavigate();
  const [deptVedhas, setDeptVedhas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeptVedhas();
  }, []);

  const fetchDeptVedhas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/trainee/api/findall_dept_vedha/");
      setDeptVedhas(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dept vedhas:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:8000/trainee/api/delete_dept_vedha/${id}/`);
        alert("Department deleted successfully");
        fetchDeptVedhas();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete department");
      }
    }
  };

  const handleEdit = (deptVedha) => {
    navigate(`/edit-dept-vedha/${deptVedha.id}`, { state: { deptVedha } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Depts</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/add-dept-vedha')}
        >
          Add Dept
        </button>
      </div>

      <div className="table-container">
        <table className="user-table" border={3}>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Department Name</th>
              <th>Location</th>
              <th>Site</th>
              <th>Dept Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deptVedhas.map((deptVedha, index) => (
              <tr key={deptVedha.id}>
                <td>{index + 1}</td>
                <td>{deptVedha.dept_name}</td>
                <td>{deptVedha.location}</td>
                <td>{deptVedha.site_name || "—"}</td>
                <td>{deptVedha.dept_admin_email || "—"}</td>
                <td className="action-cell">
                  <button 
                    className="btn btn-edit" 
                    onClick={() => handleEdit(deptVedha)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => handleDelete(deptVedha.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {deptVedhas.length === 0 && (
          <div className="no-data">
            <p>No departments found. Click "Add Dept Vedha" to create your first department.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeptVedhaTable;