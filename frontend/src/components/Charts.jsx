import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="ct-label">{label || payload[0]?.payload?.name}</p>
      {payload.map((p, i) => (
        <p key={i} className="ct-value" style={{ color: p.color || 'var(--text-primary)' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

const Charts = ({ data, trends, mode = 'overview' }) => {
  // ── Data Processing ──────────────────────────────────
  const barData = data.filter(item => item.avgResolutionTime != null).map((item, i) => ({
    name: item._id,
    avg: parseFloat(item.avgResolutionTime.toFixed(2)),
    val: item.totalComplaints,
    open: item.assignedCount,
    fill: COLORS[i % COLORS.length]
  }));

  const pieData = data.map((item, i) => ({
    name: item._id,
    value: item.totalComplaints,
    fill: COLORS[i % COLORS.length]
  }));

  const rateData = data.map((item, i) => {
    const resolved = item.totalComplaints - item.assignedCount;
    const rate = ((resolved / item.totalComplaints) * 100).toFixed(1);
    return {
      name: item._id,
      rate: parseFloat(rate),
      fill: COLORS[i % COLORS.length]
    };
  }).sort((a, b) => b.rate - a.rate);

  const trendData = trends.map(t => ({
    date: t._id,
    count: t.count
  }));

  // ── Mode-Specific Renderers ───────────────────────────

  // 1. RESOLUTION PAGE: Single large focused bar chart
  if (mode === 'resolution') {
    return (
      <div className="glass-card" style={{ gridColumn: 'span 2', minHeight: '400px' }}>
        <h2 className="section-title">⏱ Average Resolution Time by Department (Hours)</h2>
        <div className="chart-wrapper" style={{ height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} label={{ value: 'Hours', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} width={100} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="avg" name="Avg Hours" radius={[0, 4, 4, 0]}>
                {barData.map((e,i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // 2. VOLUME PAGE: Large trend area + small breakdown
  if (mode === 'volume') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', gridColumn: 'span 2' }}>
        <div className="glass-card">
          <h2 className="section-title">📈 Daily Complaint Inflow (Last 30 Days)</h2>
          <div className="chart-wrapper" style={{ height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Complaints" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorInflow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card">
          <h2 className="section-title">📊 Total Volume Breakdown by Department</h2>
          <div className="chart-wrapper" style={{ height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Total Complaints">
                  {pieData.map((e,i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // 3. SUCCESS RATE PAGE: Percentage efficiency chart
  if (mode === 'rate') {
    return (
      <div className="glass-card" style={{ gridColumn: 'span 2' }}>
        <h2 className="section-title">✅ Department Resolution Success Rate (%)</h2>
        <div className="chart-wrapper" style={{ height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={rateData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} angle={-30} textAnchor="end" interval={0} />
              <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" name="Success Rate" radius={[4, 4, 0, 0]}>
                {rateData.map((e,i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // default: OVERVIEW or any other mode
  return (
    <div className="charts-section" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-card" style={{ gridColumn: 'span 2' }}>
        <h2 className="section-title">🛠️ System Overview Trends</h2>
        <div className="chart-wrapper" style={{ height: 250 }}>
          <ResponsiveContainer>
            <AreaChart data={trendData}>
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="var(--accent-color)" fill="rgba(59,130,246,0.1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="glass-card">
          <h2 className="section-title">Efficiency Ranking</h2>
          <div className="chart-wrapper" style={{ height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={70} dataKey="value">
                  {pieData.map((e,i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card">
          <h2 className="section-title">Top Response Times</h2>
          <div className="chart-wrapper" style={{ height: 200 }}>
            <ResponsiveContainer>
               <BarChart data={barData.slice(0, 5)}>
                 <XAxis dataKey="name" fontSize={9} />
                 <YAxis fontSize={9} />
                 <Tooltip content={<CustomTooltip />} />
                 <Bar dataKey="avg" fill="var(--accent-color)" radius={4} />
               </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
