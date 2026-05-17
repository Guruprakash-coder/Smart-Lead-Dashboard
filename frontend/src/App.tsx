import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

// Basic protection (Must be logged in)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Advanced protection (Must be logged in AND be an Admin)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userString = localStorage.getItem('user');
  if (!userString) return <Navigate to="/login" />;
  
  const user = JSON.parse(userString);
  return user.role === 'Admin' ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Only Admins can access the Registration Page */}
        <Route 
          path="/register" 
          element={
            <AdminRoute>
              <Register />
            </AdminRoute>
          } 
        />

        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;