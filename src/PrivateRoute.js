import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); 


  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token, permite el acceso
  return children;
};

export default PrivateRoute;

