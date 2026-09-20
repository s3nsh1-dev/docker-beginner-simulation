import React from 'react';
import { CheckCircle, Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  filterType: string;
  onOpenModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filterType, onOpenModal }) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-primary)',
      }}>
        {filterType === 'true' ? <CheckCircle size={32} /> : <Inbox size={32} />}
      </div>

      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>
          {filterType === 'true'
            ? 'No completed tasks yet'
            : filterType === 'false'
            ? 'No active tasks found'
            : 'No tasks match your filters'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
          {filterType === 'true'
            ? 'Keep up the productivity! Tasks you mark completed will show up here.'
            : 'Create a new task to get started on your agenda.'}
        </p>
      </div>

      <button className="btn-primary" onClick={onOpenModal} style={{ marginTop: '8px' }}>
        <Plus size={18} />
        <span>Create New Task</span>
      </button>
    </div>
  );
};
