import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { users, setUsers, fetchInitialData } = useOutletContext();
  const navigate = useNavigate();

  const handleToggleUser = async (user) => {
    try {
      await adminService.updateUserStatus(user.userId, !user.active);
      toast.success(`User ${user.active ? 'suspended' : 'reactivated'}`);
      setUsers(users.map(u => u.userId === user.userId ? { ...u, active: !u.active } : u));
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleChangePlan = async (userId, plan) => {
    try {
      await adminService.updateUserPlan(userId, plan);
      toast.success(`Plan updated to ${plan}`);
      const updatedUsers = await adminService.getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      toast.error('Failed to update plan');
    }
  };

  const handleChangeRole = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role);
      toast.success(`Role updated to ${role.replace('ROLE_', '')}`);
      const updatedUsers = await adminService.getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.userId !== userId));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="admin-users">
      <div className="card">
        <div className="card-header">
          <h4>User Management</h4>
          <div className="header-actions">
            <input type="text" placeholder="Search users..." className="search-input" />
            <button className="btn-primary" onClick={() => navigate('/admin/users/create')}>Add New User</button>
          </div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId}>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{user.fullName}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </td>
                <td>
                  <select 
                    value={user.role || 'ROLE_USER'} 
                    onChange={(e) => handleChangeRole(user.userId, e.target.value)}
                    className="role-select"
                  >
                    <option value="ROLE_USER">USER</option>
                    <option value="ROLE_FREE">FREE</option>
                    <option value="ROLE_PREMIUM">PREMIUM</option>
                    <option value="ROLE_ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={user.subscriptionPlan || 'FREE'} 
                    onChange={(e) => handleChangePlan(user.userId, e.target.value)}
                    className="plan-select"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </td>
                <td>
                  <span className={`status-dot ${user.active ? 'active' : 'inactive'}`}></span>
                  {user.active ? 'Active' : 'Suspended'}
                </td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => handleToggleUser(user)} className="btn-icon">
                      {user.active ? 'Suspend' : 'Reactivate'}
                    </button>
                    <button onClick={() => handleDeleteUser(user.userId)} className="btn-icon danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
