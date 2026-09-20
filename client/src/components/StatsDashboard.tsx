import React from 'react';
import type { TodoStats } from '../types/todo';
import { ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface StatsDashboardProps {
  stats: TodoStats | null;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  if (!stats) return null;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (stats.completionRate / 100) * circumference;

  const urgentCount = stats.byPriority?.urgent || 0;

  return (
    <div className="stats-dashboard-card glass-card">
      {/* SVG Progress Ring */}
      <div className="progress-ring-container">
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track Circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="var(--border-color)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="var(--accent-primary)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            style={{
              transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease',
              filter: 'drop-shadow(0 0 6px var(--accent-glow))'
            }}
          />
          {/* Un-rotate text container inside SVG */}
          <g transform="rotate(90 70 70)">
            <text x="70" y="65" textAnchor="middle" className="ring-text-val">
              {stats.completionRate}%
            </text>
            <text x="70" y="85" textAnchor="middle" className="ring-text-sub">
              Completed
            </text>
          </g>
        </svg>
      </div>

      {/* Metrics Cards Grid */}
      <div className="stats-grid-compact">
        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <ListTodo size={20} />
          </div>
          <div>
            <div className="stat-number" id="stat-total">{stats.total}</div>
            <div className="stat-title">Total Tasks</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="stat-number" id="stat-completed">{stats.completed}</div>
            <div className="stat-title">Completed</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-number" id="stat-pending">{stats.pending}</div>
            <div className="stat-title">Pending</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="stat-number" id="stat-urgent">{urgentCount}</div>
            <div className="stat-title">Urgent Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
};
