import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Users, UserCheck, GraduationCap, Database } from 'lucide-react';

const UserManagementApp = () => {
  const [activeView, setActiveView] = useState('SiteAdmins');
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedSite, setSelectedSite] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    access_level: '',
    password: '',
    confirm_password: '',
    site_id: '',
    department_id: '',
    role: ''
  });

  const accessLevels = ['Admin', 'Manager', 'User', 'Viewer'];

  // Base URL for your Django backend
  const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your Django server URL

  useEffect(() => {
    fetchSites();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsersByRole();
  }, [activeView]);

  const fetchSites = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/`);
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const fetchDepartments = async (siteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/departments/${siteId}/`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/findall/`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterUsersByRole = async () => {
    try {
      setLoading(true);
      let role = '';
      switch (activeView) {
        case 'SiteAdmins':
          role = 'Site Admin';
          break;
        case 'DepartmentAdmins':
          role = 'Department Admin';
          break;
        case 'Trainee':
          role = 'Trainee';
          break;
        case 'UserTable':
          await fetchUsers();
          setLoading(false);
          return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/find/${role}/`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error filtering users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'site_id') {
      setSelectedSite(value);
      if (value) {
        fetchDepartments(value);
      } else {
        setDepartments([]);
      }
      setFormData(prev => ({
        ...prev,
        department_id: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match!');
      return;
    }

    const submitData = { ...formData };
    delete submitData.confirm_password;

    // Set role based on active view
    if (activeView === 'SiteAdmins') {
      submitData.role = 'Site Admin';
    } else if (activeView === 'DepartmentAdmins') {
      submitData.role = 'Department Admin';
    } else if (activeView === 'Trainee') {
      submitData.role = 'Trainee';
    }

    try {
      let response;
      if (editingUser) {
        response = await fetch(`${API_BASE_URL}/api/update/${editingUser.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/save/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }
      
      if (response.ok) {
        alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
        setShowForm(false);
        setEditingUser(null);
        resetForm();
        filterUsersByRole();
      } else {
        throw new Error('Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      middle_name: user.middle_name || '',
      last_name: user.last_name,
      email: user.email,
      access_level: user.access_level,
      password: '',
      confirm_password: '',
      site_id: user.site?.id || '',
      department_id: user.department?.id || '',
      role: user.role
    });
    
    if (user.site?.id) {
      fetchDepartments(user.site.id);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/delete/${id}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('User deleted successfully!');
          filterUsersByRole();
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      access_level: '',
      password: '',
      confirm_password: '',
      site_id: '',
      department_id: '',
      role: ''
    });
    setSelectedSite('');
    setDepartments([]);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    resetForm();
    setShowForm(true);
  };

  const getIcon = (view) => {
    switch (view) {
      case 'SiteAdmins': return <UserCheck className="w-4 h-4" />;
      case 'DepartmentAdmins': return <Users className="w-4 h-4" />;
      case 'Trainee': return <GraduationCap className="w-4 h-4" />;
      case 'UserTable': return <Database className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const renderForm = () => {
    const needsSiteAndDept = activeView === 'Trainee';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {editingUser ? 'Edit' : 'Add'} {activeView.replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          
          <div onSubmit={handleSubmit} className="space-y-4"
               onKeyDown={(e) => e.key === 'Enter' && e.target.type !== 'submit' && e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1">First Name*</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Last Name*</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Access Level*</label>
              <select
                name="access_level"
                value={formData.access_level}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Access Level</option>
                {accessLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            {needsSiteAndDept && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Site*</label>
                  <select
                    name="site_id"
                    value={formData.site_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Site</option>
                    {sites.map(site => (
                      <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Department*</label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.site_id}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password*</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                required={!editingUser}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {editingUser ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Navigation Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-4">
            <h1 className="text-xl font-bold mb-6 text-gray-800">User Management</h1>
            <nav className="space-y-2">
              {['SiteAdmins', 'DepartmentAdmins', 'Trainee', 'UserTable'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
                    activeView === view
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getIcon(view)}
                  {view.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeView.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-3 text-left">ID</th>
                        <th className="border p-3 text-left">First Name</th>
                        <th className="border p-3 text-left">Middle Name</th>
                        <th className="border p-3 text-left">Last Name</th>
                        <th className="border p-3 text-left">Email</th>
                        <th className="border p-3 text-left">Access Level</th>
                        {activeView === 'Trainee' && (
                          <>
                            <th className="border p-3 text-left">Site</th>
                            <th className="border p-3 text-left">Department</th>
                          </>
                        )}
                        <th className="border p-3 text-left">Role</th>
                        <th className="border p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="border p-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border p-3">{user.id}</td>
                            <td className="border p-3">{user.first_name}</td>
                            <td className="border p-3">{user.middle_name || '-'}</td>
                            <td className="border p-3">{user.last_name}</td>
                            <td className="border p-3">{user.email}</td>
                            <td className="border p-3">{user.access_level}</td>
                            {activeView === 'Trainee' && (
                              <>
                                <td className="border p-3">{user.site?.name || '-'}</td>
                                <td className="border p-3">{user.department?.name || '-'}</td>
                              </>
                            )}
                            <td className="border p-3">{user.role}</td>
                            <td className="border p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && renderForm()}
    </div>
  );
};

export default UserManagementApp;