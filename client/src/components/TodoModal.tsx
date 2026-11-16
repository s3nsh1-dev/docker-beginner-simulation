import React, { useState, useEffect } from 'react';
import type { Todo, CreateTodoInput, UpdateTodoInput, PriorityLevel, Category } from '../types/todo';
import { X, Plus, Save } from 'lucide-react';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (data: CreateTodoInput) => Promise<any>;
  onSubmitUpdate: (id: number, data: UpdateTodoInput) => Promise<any>;
  editingTodo: Todo | null;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  editingTodo,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [category, setCategory] = useState<Category>('general');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize form values whenever modal opens or editingTodo changes
  useEffect(() => {
    if (!isOpen) return;

    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority);
      setCategory(editingTodo.category);
      setDueDate(editingTodo.due_date ? editingTodo.due_date.substring(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('general');
      setDueDate('');
    }
    setErrorMsg('');
  }, [editingTodo, isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Task title is required');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      if (editingTodo) {
        await onSubmitUpdate(editingTodo.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          due_date: dueDate || null,
        });
      } else {
        await onSubmitCreate({
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          due_date: dueDate || null,
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-heading" className="modal-title">
            {editingTodo ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'var(--status-urgent-bg)',
              color: 'var(--status-urgent)',
              border: '1px solid var(--status-urgent-border)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              fontSize: '0.8125rem',
            }}
            role="alert"
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-todo-title">Task title *</label>
            <input
              id="modal-todo-title"
              type="text"
              className="input-glass"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-todo-desc">Description</label>
            <textarea
              id="modal-todo-desc"
              className="input-glass"
              rows={3}
              placeholder="Add optional notes, context, or checklist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-grid">
            {/* Priority */}
            <div className="form-group">
              <label className="form-label" htmlFor="modal-todo-priority">Priority</label>
              <select
                id="modal-todo-priority"
                className="select-glass"
                style={{ width: '100%' }}
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="modal-todo-category">Category</label>
              <select
                id="modal-todo-category"
                className="select-glass"
                style={{ width: '100%' }}
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
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-todo-duedate">Due date</label>
            <input
              id="modal-todo-duedate"
              type="date"
              className="input-glass"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="modal-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {editingTodo ? <Save size={16} /> : <Plus size={16} />}
              <span>{editingTodo ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
