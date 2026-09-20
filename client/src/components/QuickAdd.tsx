import React, { useState } from 'react';
import type { PriorityLevel, Category, CreateTodoInput } from '../types/todo';
import { Plus, Tag, AlertCircle } from 'lucide-react';

interface QuickAddProps {
  onAdd: (input: CreateTodoInput) => Promise<void>;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [category, setCategory] = useState<Category>('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        priority,
        category,
      });
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="quick-add-card glass-card" onSubmit={handleSubmit}>
      <div className="quick-add-row">
        <input
          id="quick-todo-input"
          type="text"
          className="input-glass"
          placeholder="What needs to be done? Press Enter to quickly add..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />
        <button
          id="btn-quick-add"
          type="submit"
          className="btn-primary"
          disabled={!title.trim() || submitting}
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>

      <div className="quick-add-options">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            id="quick-priority-select"
            className="select-glass"
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
          >
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🟠 High Priority</option>
            <option value="urgent">🔴 Urgent Priority</option>
            <option value="low">🔵 Low Priority</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            id="quick-category-select"
            className="select-glass"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="general">📌 General</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="shopping">🛒 Shopping</option>
            <option value="health">❤️ Health</option>
          </select>
        </div>
      </div>
    </form>
  );
};
