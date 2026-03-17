import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Award, Users } from 'lucide-react';

const Leaderboard = ({ data }) => {
  // Sort by avgResolutionTime ascending; null (no resolutions yet) go last
  const sorted = useMemo(
    () =>
      [...data].sort((a, b) => {
        if (a.avgResolutionTime === null) return 1;
        if (b.avgResolutionTime === null) return -1;
        return a.avgResolutionTime - b.avgResolutionTime;
      }),
    [data]
  );

  const fastest = sorted.find((d) => d.avgResolutionTime != null);
  const slowest  = [...sorted].reverse().find((d) => d.avgResolutionTime != null);
  const mostOpen = [...data].sort((a, b) => b.assignedCount - a.assignedCount)[0];

  const insights = useMemo(() => {
    const list = [];
    if (fastest) {
      list.push({
        cls: 'pos',
        icon: <TrendingUp size={16} color="var(--success-color)" />,
        text: `${fastest._id} resolves fastest — avg ${fastest.avgResolutionTime.toFixed(1)} hours.`
      });
    }
    if (slowest && slowest._id !== fastest?._id) {
      list.push({
        cls: 'neg',
        icon: <TrendingDown size={16} color="var(--danger-color)" />,
        text: `${slowest._id} is the slowest — avg ${slowest.avgResolutionTime.toFixed(1)} hours. Needs attention.`
      });
    }
    if (mostOpen?.assignedCount > 0) {
      list.push({
        cls: 'neutral',
        icon: <Users size={16} color="var(--warning-color)" />,
        text: `${mostOpen._id} has the most open complaints: ${mostOpen.assignedCount} still pending.`
      });
    }
    return list;
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Key Insights ─────────────────────────────────── */}
      <div className="glass-card">
        <h2 className="section-title">
          <Award size={18} color="var(--warning-color)" />
          Key Insights
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {insights.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Insights will appear once data is loaded.</p>
          )}
          {insights.map((ins, i) => (
            <div key={i} className={`insight-item ${ins.cls}`}>
              <div style={{ marginTop: 2 }}>{ins.icon}</div>
              <span>{ins.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Department Rankings ───────────────────────────── */}
      <div className="glass-card">
        <h2 className="section-title">
          <Target size={18} color="var(--accent-color)" />
          Department Leaderboard
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
          Ranked by fastest resolution time ↑
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sorted.map((dept, i) => {
            const isTop   = dept._id === fastest?._id;
            const isWorst = dept._id === slowest?._id && sorted.length > 1;

            return (
              <div
                key={dept._id}
                className={`lb-item${isTop ? ' top' : isWorst ? ' worst' : ''}`}
              >
                {/* Left: rank + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="lb-rank">{i + 1}</div>
                  <div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: isTop ? '#34d399' : isWorst ? '#f87171' : 'var(--text-primary)'
                    }}>
                      {dept._id}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>{dept.totalComplaints} total</span>
                      {dept.assignedCount > 0 && (
                        <span className="badge pending">
                          {dept.assignedCount} open
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: avg resolution time */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {dept.avgResolutionTime != null ? (
                    <>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                        {dept.avgResolutionTime.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> hrs</span>
                    </>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(100,116,139,0.15)', color: 'var(--text-muted)' }}>
                      No data
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
