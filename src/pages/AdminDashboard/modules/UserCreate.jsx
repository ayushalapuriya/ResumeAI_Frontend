import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const UserCreate = () => {
  const { fetchInitialData } = useOutletContext();
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    role: 'ROLE_USER', 
    subscriptionPlan: 'FREE' 
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(newUser);
      toast.success('User created successfully');
      await fetchInitialData();
      navigate('/admin/users');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <div className="admin-users-create">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header">
          <h4>Create New User</h4>
        </div>
        <form onSubmit={handleAddUser} style={{ padding: '24px' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={newUser.fullName} 
              onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={newUser.email} 
              onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={newUser.password} 
              onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
              <option value="ROLE_USER">User</option>
              <option value="ROLE_FREE">Free</option>
              <option value="ROLE_PREMIUM">Premium</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Initial Plan</label>
            <select value={newUser.subscriptionPlan} onChange={(e) => setNewUser({...newUser, subscriptionPlan: e.target.value})}>
              <option value="FREE">FREE</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
          <div className="modal-actions" style={{ marginTop: '32px' }}>
            <button type="button" onClick={() => navigate('/admin/users')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;
