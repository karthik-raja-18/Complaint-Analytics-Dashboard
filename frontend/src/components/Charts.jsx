import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="ct-label">{label || payload[0]?.payload?.name}</p>
      {payload.map((p, i) => (
        <p key={i} className="ct-value" style={{ color: p.color || 'var(--text-primary)' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

const Charts = ({ data, type }) => {
  // Only departments with a valid avgResolutionTime go into the bar chart
  const barData = data
    .filter(item => item.avgResolutionTime != null)
    .map((item, i) => ({
      name: item._id,
      avgResolutionTime: parseFloat(item.avgResolutionTime.toFixed(2)),
      fill: COLORS[i % COLORS.length]
    }));

  // All departments in the pie (by totalComplaints)
  const pieData = data.map((item, i) => ({
    name: item._id,
    totalComplaints: item.totalComplaints,
    assignedCount: item.assignedCount,
    fill: COLORS[i % COLORS.length]
  }));

  const showResolution = !type || type === 'resolution';
  const showVolume = !type || type === 'volume';
  const showRate = !type || type === 'rate';

  // Rate data: Percentage of resolved vs total
  const rateData = data.map((item, i) => {
    const resolved = item.totalComplaints - (item.assignedCount || 0);
    const rate = item.totalComplaints > 0 ? (resolved / item.totalComplaints) * 100 : 0;
    return {
      name: item._id,
      rate: parseFloat(rate.toFixed(1)),
      resolved,
      pending: item.assignedCount || 0,
      fill: COLORS[i % COLORS.length]
    };
  }).sort((a,b) => b.rate - a.rate);

  return (
    <div className="charts-section">
      {/* ── Bar chart: resolution time ────────────────────── */}
      {showResolution && (
        <div className="glass-card stagger-1">
          <h2 className="section-title">⏱ Avg Resolution Time (Hours)</h2>
          {barData.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem 0' }}>
              No resolved complaints yet — resolution times will appear here.
            </p>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} stroke="var(--card-border)" />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} stroke="var(--card-border)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgResolutionTime" name="Avg Hours" radius={[5, 5, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── Pie chart: complaint volume ───────────────────── */}
      {showVolume && (
        <div className="glass-card stagger-2">
          <h2 className="section-title">📊 Complaint Volume</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="totalComplaints"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--text-muted)' }}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Bar chart: Resolution Rate % ──────────────────── */}
      {showRate && (
        <div className="glass-card stagger-3">
          <h2 className="section-title">📈 Resolution Success Rate (%)</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rateData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} stroke="var(--card-border)" />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} stroke="var(--card-border)" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name="Resolution %" radius={[0, 5, 5, 0]} barSize={20}>
                  {rateData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
