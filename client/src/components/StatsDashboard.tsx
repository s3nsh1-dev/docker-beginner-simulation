import React from 'react';
import type { TodoStats } from '../types/todo';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface StatsDashboardProps {
  stats: TodoStats | null;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  if (!stats) return null;

  const urgentCount = stats.byPriority?.urgent || 0;

  return (
    <section className="stats-dashboard-card glass-card" aria-label="Task telemetry overview">
      {/* Metrics Grid */}
      <div className="stats-grid-compact">
        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'var(--surface-input)', color: 'var(--text-secondary)' }}>
            <ListTodo size={17} />
          </div>
          <div>
            <div className="stat-number" id="stat-total">{stats.total}</div>
            <div className="stat-title">Total tasks</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
            <CheckCircle2 size={17} />
          </div>
          <div>
            <div className="stat-number" id="stat-completed">{stats.completed}</div>
            <div className="stat-title">Completed</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-medium-bg)', color: 'var(--status-medium)' }}>
            <Clock size={17} />
          </div>
          <div>
            <div className="stat-number" id="stat-pending">{stats.pending}</div>
            <div className="stat-title">Pending</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-urgent-bg)', color: 'var(--status-urgent)' }}>
            <AlertCircle size={17} />
          </div>
          <div>
            <div className="stat-number" id="stat-urgent">{urgentCount}</div>
            <div className="stat-title">Urgent</div>
          </div>
        </div>
      </div>

      {/* Linear Precision Progress Strip */}
      <div className="stats-progress-strip">
        <div className="stats-progress-header">
          <span className="stats-progress-label">Completion velocity</span>
          <span className="stats-progress-value">{stats.completionRate}%</span>
        </div>
        <div className="stats-progress-track" role="progressbar" aria-valuenow={stats.completionRate} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="stats-progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, stats.completionRate))}%` }}
          />
        </div>
      </div>
    </section>
  );
};
