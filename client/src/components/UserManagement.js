import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import api from '../services/api';
import UserModal from './UserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowUserModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleUserSaved = () => {
    setShowUserModal(false);
    fetchUsers();
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return { backgroundColor: '#ef4444', color: 'white' };
      case 'store_owner':
        return { backgroundColor: '#10b981', color: 'white' };
      default:
        return { backgroundColor: '#6b7280', color: 'white' };
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#111827' }}>User Management</h1>
        <button onClick={handleCreateUser} className="btn btn-primary">
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Add User
        </button>
      </div>

      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }}
          />
          <input
            type="text"
            placeholder="Search users by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        
        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="role">Role</option>
            <option value="created_at">Date Created</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.address}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          ...getRoleBadgeColor(user.role)
                        }}
                      >
                        {user.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleViewUser(user)}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showUserModal && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => setShowUserModal(false)}
          onSave={handleUserSaved}
        />
      )}
    </div>
  );
};

export default UserManagement;



