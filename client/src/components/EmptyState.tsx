import React from 'react';
import { CheckCircle2, Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  filterType: string;
  onOpenModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filterType, onOpenModal }) => {
  return (
    <div className="empty-state-card glass-card">
      <div className="empty-state-icon" aria-hidden="true">
        {filterType === 'true' ? <CheckCircle2 size={24} /> : <Inbox size={24} />}
      </div>

      <div>
        <h3 className="empty-state-title">
          {filterType === 'true'
            ? 'No completed tasks yet'
            : filterType === 'false'
            ? 'No active tasks found'
            : 'No tasks match current filter'}
        </h3>
        <p className="empty-state-desc" style={{ marginTop: '4px' }}>
          {filterType === 'true'
            ? 'Tasks you check off will appear here for reference.'
            : 'Capture your next action item to stay on track.'}
        </p>
      </div>

      <button type="button" className="btn-primary" onClick={onOpenModal} style={{ marginTop: '6px' }}>
        <Plus size={16} />
        <span>Create New Task</span>
      </button>
    </div>
  );
};
