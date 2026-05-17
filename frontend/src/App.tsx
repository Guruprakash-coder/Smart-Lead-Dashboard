import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';

// Basic protection (Must be logged in)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Advanced protection (Must be logged in AND be an Admin)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userString = localStorage.getItem('user');
  
  // If no user or the storage is corrupted with the word "undefined"
  if (!userString || userString === 'undefined') {
    localStorage.removeItem('user'); // Self-heal: clean up the mess
    return <Navigate to="/login" />;
  }
  
  try {
    const user = JSON.parse(userString);
    return user.role === 'Admin' ? <>{children}</> : <Navigate to="/" />;
  } catch (error) {
    // If JSON.parse fails, wipe the corrupted data and redirect
    localStorage.removeItem('user');
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* The missing route: Only Admins can access the User Management Page */}
        <Route 
          path="/users" 
          element={
            <AdminRoute>
              <ManageUsers />
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