import React, { useState } from 'react';
import type { PriorityLevel, Category, CreateTodoInput } from '../types/todo';
import { Plus } from 'lucide-react';

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
    <form className="quick-add-card glass-card" onSubmit={handleSubmit} aria-label="Quick task creation">
      <div className="quick-add-row">
        <input
          id="quick-todo-input"
          type="text"
          className="input-glass quick-input"
          placeholder="Capture new task... (press Enter to add)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          id="btn-quick-add"
          type="submit"
          className="btn-primary quick-add-btn"
          disabled={!title.trim() || submitting}
        >
          <Plus size={15} />
          <span>Add</span>
        </button>
      </div>

      <div className="quick-add-options">
        <select
          id="quick-priority-select"
          aria-label="Priority"
          className="select-glass"
          value={priority}
          onChange={(e) => setPriority(e.target.value as PriorityLevel)}
        >
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
          <option value="urgent">Urgent priority</option>
          <option value="low">Low priority</option>
        </select>

        <select
          id="quick-category-select"
          aria-label="Category"
          className="select-glass"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
        </select>
      </div>
    </form>
  );
};
