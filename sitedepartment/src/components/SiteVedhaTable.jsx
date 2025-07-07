import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function SiteVedhaTable() {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchusers()
    }, [])

    const fetchusers = () => {
        axios.get("http://localhost:8000/trainee/api/findall_site_vedha/")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error loading users:",err));
    };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this user?")){
        axios.delete(`http://localhost:8000/trainee/api/delete_site_vedha/${id}/`)
        .then(() => {
            alert("Deleted Succefully")
            fetchusers()
        })
        .catch((err) => console.error("Delete Error:", err))
    }
  }

    const handleEdit = (id) => {
      navigate(`/edit-site-vedha/${id}`);
    };

   const handleAddUser = () => {
    navigate("/add-site-vedha");
  };
    return(
        <>
        <div className="page-container">
        <div className="page-header">
        <h1>Sites</h1>
        <button className="add-user-btn" onClick={handleAddUser}>
          Add sites
        </button>
        </div>
         <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Site Name</th>
              <th>Locations</th>
              {/* <th>Simulations</th>
              <th>Site Admins</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
            <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.site_name}</td>
                <td>{user.location}</td>
                {/* <td>{user.simulations}</td>
                <td>{user.site_admin}</td> */}
                <td className="action-cell">
                <button className="btn btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
            </tr>
            ))}
          </tbody>
          </table>


          {users.length == 0 && (
            <div className="no-data">
            <p>No Site Vedha Found...</p>
            </div>
          )}
          </div>
          </div>
          
        </>
    )
}

export default SiteVedhaTable; 