import React, { useState, useEffect } from 'react';
import type { Todo, CreateTodoInput, UpdateTodoInput, PriorityLevel, Category } from '../types/todo';
import { X, Save, Plus } from 'lucide-react';

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

  useEffect(() => {
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Title is required');
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
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        });
      } else {
        await onSubmitCreate({
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving todo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingTodo ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#f43f5e',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.85rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-todo-title">Task Title *</label>
            <input
              id="modal-todo-title"
              type="text"
              className="input-glass"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-todo-desc">Description</label>
            <textarea
              id="modal-todo-desc"
              className="input-glass"
              rows={3}
              placeholder="Add extra details or notes..."
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
            <label className="form-label" htmlFor="modal-todo-duedate">Due Date</label>
            <input
              id="modal-todo-duedate"
              type="date"
              className="input-glass"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button id="modal-submit-btn" type="submit" className="btn-primary" disabled={submitting}>
              {editingTodo ? <Save size={18} /> : <Plus size={18} />}
              <span>{editingTodo ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
