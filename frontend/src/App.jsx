import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AIChatbot from './components/AIChatbot';

import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';

const PUBLIC_PATHS = ['/', '/login', '/register'];

const AppContent = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  // ── Dark / Light mode ────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : true; // default: dark
  });

  useEffect(() => {
    document.body.classList.toggle('light', !darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ── Show sidebar only for authenticated, non-public pages ─────────
  const showSidebar = token && !isPublic;

  return (
    <div className={showSidebar ? 'app-shell' : ''}>
      {showSidebar && <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

      <div className={showSidebar ? 'main-content' : ''}>
        <div className={showSidebar ? 'page-body' : ''}>
          <Routes>
            <Route path="/"          element={<Landing />} />
            <Route path="/login"     element={<Login />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/resolution" element={
              <ProtectedRoute><Dashboard mode="resolution" /></ProtectedRoute>
            } />
            <Route path="/volume" element={
              <ProtectedRoute><Dashboard mode="volume" /></ProtectedRoute>
            } />
            <Route path="/rate" element={
              <ProtectedRoute><Dashboard mode="rate" /></ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute><Dashboard mode="leaderboard" /></ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute><UploadPage /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AIChatbot />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
