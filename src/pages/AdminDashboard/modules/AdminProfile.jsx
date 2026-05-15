import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ProfilePage from '../../../components/dashboard/ProfilePage';

const AdminProfile = () => {
  const { user, fetchInitialData } = useOutletContext();
  const navigate = useNavigate();

  return (
    <ProfilePage 
      user={user} 
      userRole="System Administrator" 
      resumeCount={0} 
      score={0} 
      onBack={() => navigate('/admin')}
      onSaveProfile={fetchInitialData}
    />
  );
};

export default AdminProfile;
