import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, Upload, LogOut, Moon, Sun, BarChart3,
  Settings, Menu, X, Clock, Zap, Trophy
} from 'lucide-react';

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { 
    logout(); 
    navigate('/'); 
  };

  // User initials avatar
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '??';

  return (
    <>
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <BarChart3 size={18} color="white" />
          </div>
          <div>
            <div className="sidebar-brand-text">Complaint Analytics</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Overview</div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <LayoutDashboard size={18} className="nav-icon" />
            Dashboard
          </NavLink>

          <div className="nav-section-label">Analytics Pages</div>

          <NavLink
            to="/resolution"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Clock size={18} className="nav-icon" />
            Resolution Time
          </NavLink>

          <NavLink
            to="/volume"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <BarChart3 size={18} className="nav-icon" />
            Complaint Volume
          </NavLink>

          <NavLink
            to="/rate"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Zap size={18} className="nav-icon" />
            Success Rate
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Trophy size={18} className="nav-icon" />
            Department Rankings
          </NavLink>

          <div className="nav-section-label">Tools</div>

          <NavLink
            to="/upload"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Upload size={18} className="nav-icon" />
            Upload Data
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* Theme toggle */}
          <button
            className="nav-link"
            onClick={toggleDarkMode}
            style={{ justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span style={{
              width: 34, height: 18, borderRadius: 9,
              background: darkMode ? 'var(--accent-color)' : '#cbd5e1',
              position: 'relative', display: 'inline-block', flexShrink: 0
            }}>
              <span style={{
                position: 'absolute', top: 2,
                left: darkMode ? 18 : 2,
                width: 14, height: 14, borderRadius: '50%',
                background: 'white', transition: 'left 0.2s'
              }} />
            </span>
          </button>

          {/* User info
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem' }}>
            <div className="user-avatar">{initials}</div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </span>
          </div> */}

          {/* Logout */}
          <button className="nav-link" onClick={handleLogout} style={{ color: '#f87171' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
