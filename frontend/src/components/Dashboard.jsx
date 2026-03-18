import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RefreshCw, AlertCircle, List, CheckCircle2, Clock, Activity, Download, Trash2 } from 'lucide-react';
import Charts from './Charts';
import Leaderboard from './Leaderboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = ({ mode = 'overview' }) => {
  const [data, setData] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('');

  // Mode-based labels/titles
  const PAGE_TITLES = {
    overview: "Main Summary Dashboard",
    resolution: "Resolution Time Analysis",
    volume: "In-Depth Volume Analytics",
    rate: "Department Success Rate",
    leaderboard: "Performance Leaderboard"
  };

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const url = sourceFilter ? `${API_URL}/dashboard?source=${sourceFilter}` : `${API_URL}/dashboard`;
      const response = await axios.get(url);
      setData(response.data.summary || []);
      setTrends(response.data.trends || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.status === 401 ? 'Session expired.' : 'Failed to fetch dashboard data.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [sourceFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const id = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset the dashboard? All data will be permanently deleted.')) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/dashboard/reset`);
      await fetchData();
    } catch (err) {
      setError('Failed to reset dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const totalComplaints = data.reduce((s, d) => s + (d.totalComplaints || 0), 0);
  const totalAssigned   = data.reduce((s, d) => s + (d.assignedCount   || 0), 0);
  const totalResolved   = totalComplaints - totalAssigned;

  return (
    <div className="fade-in">
      <div className="header-actions">
        <div>
          <h1 className="dashboard-title">{PAGE_TITLES[mode] || "Dashboard"}</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sourceFilter ? `Source: ${sourceFilter}` : 'Aggregating all data streams'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '4px', display: 'inline-flex', gap: '4px', borderRadius: '10px' }}>
            {['', 'SpringBoot', 'Upload'].map(s => (
              <button key={s} className={`btn ${sourceFilter === s ? '' : 'btn-ghost'}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => setSourceFilter(s)}>
                {s || 'All Data'}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => fetchData()} disabled={loading}><RefreshCw size={15} className={loading ? 'spinning' : ''} /></button>
          
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ color: '#f87171' }} onClick={handleReset} disabled={loading}><Trash2 size={16} /> Reset</button>
          <button className="btn" onClick={() => {}} disabled={!data.length}><Download size={16} /> Export</button>
        </div>
      </div>

      {/* Stat Grid - Hide on Leaderboard as it has its own insights */}
      {!loading && data.length > 0 && mode !== 'leaderboard' && (
        <div className="stat-grid">
          {(mode === 'overview' || mode === 'volume') && <StatCard icon={<List size={20} color="var(--accent-color)" />} value={totalComplaints} label="Total" color="rgba(59,130,246,0.15)" />}
          {(mode === 'overview' || mode === 'rate') && <StatCard icon={<CheckCircle2 size={20} color="var(--success-color)" />} value={totalResolved} label="Resolved" color="rgba(16,185,129,0.15)" />}
          {(mode === 'overview' || mode === 'rate') && <StatCard icon={<Clock size={20} color="var(--warning-color)" />} value={totalAssigned} label="Pending" color="rgba(245,158,11,0.15)" />}
          {mode === 'resolution' && <StatCard icon={<Activity size={20} color="#60a5fa" />} value={data.length} label="Active Depts" color="rgba(59,130,246,0.1)" />}
        </div>
      )}

      {loading ? <LoadingState /> : data.length === 0 ? <EmptyState sourceFilter={sourceFilter} /> : (
        <div className={mode === 'leaderboard' ? "leaderboard-only-layout" : "dashboard-grid"}>
          {mode !== 'leaderboard' && <Charts data={data} trends={trends} mode={mode} />}
          {(mode === 'overview' || mode === 'leaderboard') && (
            <div style={mode === 'leaderboard' ? { maxWidth: '800px', margin: '0 auto', width: '100%' } : {}}>
              <Leaderboard data={data} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color }}>{icon}</div>
    <div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
  </div>
);

const LoadingState = () => (
  <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
    <RefreshCw size={28} className="spinning" style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
    <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
  </div>
);

const EmptyState = ({ sourceFilter }) => (
  <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>{sourceFilter === 'SpringBoot' ? 'No Spring Boot data received.' : 'No data yet.'}</p>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{sourceFilter === 'SpringBoot' ? 'Waiting for POST http://localhost:5000/api/sync' : 'Upload data or wait for sync.'}</p>
  </div>
);

export default Dashboard;
