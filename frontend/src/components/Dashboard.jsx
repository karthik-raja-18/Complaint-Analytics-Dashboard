import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RefreshCw, AlertCircle, Activity, CheckCircle2, Clock, List, Download } from 'lucide-react';
import Charts from './Charts';
import Leaderboard from './Leaderboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds

const Dashboard = ({ mode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sourceFilter, setSourceFilter] = useState(''); // '' (all), 'SpringBoot', 'Upload'

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const url = sourceFilter
        ? `${API_URL}/dashboard?source=${sourceFilter}`
        : `${API_URL}/dashboard`;

      const response = await axios.get(url);
      setData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError('Failed to fetch dashboard data. Make sure the backend is running.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [sourceFilter]);

  // Initial fetch
  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 10 seconds (silent — no loading spinner)
  useEffect(() => {
    const id = setInterval(() => fetchData(true), AUTO_REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  // Derived totals for stat cards
  const totalComplaints = data.reduce((s, d) => s + (d.totalComplaints || 0), 0);
  const totalAssigned = data.reduce((s, d) => s + (d.assignedCount || 0), 0);
  const totalResolved = totalComplaints - totalAssigned;

  const exportCSV = () => {
    if (!data.length) return;
    let csv = 'Department,Avg Resolution (hrs),Total Complaints,Assigned/Open\n';
    data.forEach((r) => {
      csv += `${r._id},${r.avgResolutionTime != null ? r.avgResolutionTime.toFixed(2) : 'N/A'},${r.totalComplaints},${r.assignedCount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'dashboard_analytics.csv' });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const isOverview = !mode;
  const isResolution = mode === 'resolution';
  const isVolume = mode === 'volume';
  const isRate = mode === 'rate';
  const isLeaderboard = mode === 'leaderboard';

  const pageTitle = isResolution 
    ? '⏱ Resolution Analytics' 
    : isVolume 
    ? '📊 Volume Analytics' 
    : isRate 
    ? '📈 Success Rate Analytics'
    : isLeaderboard
    ? '🏅 Department Leaderboard'
    : '📊 Dashboard Overview';

  return (
    <div className="fade-in">
      {/* ── Action bar ───────────────────────────────────────── */}
      <div className="header-actions">
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Source Tabs */}
          <div className="glass-card" style={{ padding: '4px', display: 'inline-flex', gap: '4px', borderRadius: '10px' }}>
            <button
              className={`btn ${sourceFilter === '' ? '' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setSourceFilter('')}
            >
              All Data
            </button>
            <button
              className={`btn ${sourceFilter === 'SpringBoot' ? '' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setSourceFilter('SpringBoot')}
            >
              Civic Issue reporting
            </button>
            <button
              className={`btn ${sourceFilter === 'Upload' ? '' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setSourceFilter('Upload')}
            >
              Manual Upload
            </button>
          </div>

          <button className="btn btn-secondary" onClick={() => fetchData()} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>

        {isOverview && (
          <button className="btn" onClick={exportCSV} disabled={!data.length}>
            <Download size={16} />
            Export CSV
          </button>
        )}
      </div>

      {/* ── Error banner ──────────────────────────────────────── */}
      {error && (
        <div className="glass-card" style={{
          backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.35)',
          marginBottom: '1.25rem', display: 'flex', alignItems: 'center',
          gap: '0.75rem', color: '#fca5a5', padding: '0.85rem 1rem'
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* ── Stat cards (Only for Overview) ────────────────────── */}
      {isOverview && !loading && data.length > 0 && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <List size={20} color="var(--accent-color)" />
            </div>
            <div>
              <div className="stat-value">{totalComplaints}</div>
              <div className="stat-label">Total Reports</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <CheckCircle2 size={20} color="var(--success-color)" />
            </div>
            <div>
              <div className="stat-value">{totalResolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Clock size={20} color="var(--warning-color)" />
            </div>
            <div>
              <div className="stat-value">{totalAssigned}</div>
              <div className="stat-label">Open Issues</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Content area ─────────────────────────────────────── */}
      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <RefreshCw size={28} className="spinning" style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>No data yet.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Upload data or wait for sync from the backend.
          </p>
        </div>
      ) : (
        <div className={(isOverview || isLeaderboard) ? "dashboard-grid" : ""}>
          {(isOverview || isResolution || isVolume || isRate) && (
            <Charts data={data} type={mode} />
          )}
          {(isOverview || isLeaderboard) && (
            <Leaderboard data={data} />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
