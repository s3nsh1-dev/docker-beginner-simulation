import React, { useState } from 'react';
import type { Todo } from '../types/todo';
import { Check, Edit2, Trash2, Calendar, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Relative due date calculation
  const getDueStatus = (dueDateStr: string | null) => {
    if (!dueDateStr) return null;
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    // Normalize both to local midnight to compare calendar dates, not timestamps
    const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (todo.completed) {
      return { text: due.toLocaleDateString(), isOverdue: false };
    }

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false, isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isOverdue: false };
    } else {
      return { text: `Due in ${diffDays}d`, isOverdue: false };
    }
  };

  const dueStatus = getDueStatus(todo.due_date);

  return (
    <article
      className={`todo-card glass-card ${todo.completed ? 'completed' : ''}`}
      data-testid={`todo-card-${todo.id}`}
    >
      {/* Accessible Checkbox */}
      <button
        type="button"
        className={`checkbox-custom ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={`Mark task "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      >
        {todo.completed && <Check size={13} strokeWidth={3} />}
      </button>

      {/* Main Content */}
      <div className="todo-content">
        <div className="todo-header-row">
          <div className={`todo-title ${todo.completed ? 'strikethrough' : ''}`}>
            {todo.title}
          </div>

          {todo.description && todo.description.length >= 80 && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => setExpanded(!expanded)}
              style={{ padding: '2px' }}
              title={expanded ? 'Collapse details' : 'Expand details'}
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse description' : 'Expand description'}
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
        </div>

        {/* Description */}
        {todo.description && (
          <p className="todo-desc">
            {expanded || todo.description.length < 80
              ? todo.description
              : `${todo.description.slice(0, 80)}...`}
          </p>
        )}

        <div className="todo-meta">
          {/* Priority Badge */}
          <span className={`badge badge-${todo.priority}`}>
            {todo.priority}
          </span>

          {/* Category Badge */}
          <span className="badge badge-category">
            {todo.category}
          </span>

          {/* Relative Due Date Chip */}
          {dueStatus && (
            <span
              className="due-date-chip"
              style={
                dueStatus.isOverdue
                  ? { color: 'var(--status-urgent)', background: 'var(--status-urgent-bg)', borderColor: 'var(--status-urgent-border)' }
                  : dueStatus.isToday
                  ? { color: 'var(--status-medium)', background: 'var(--status-medium-bg)', borderColor: 'var(--status-medium-border)' }
                  : {}
              }
            >
              {dueStatus.isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
              <span>{dueStatus.text}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          type="button"
          className="icon-btn edit-todo-btn"
          onClick={() => onEdit(todo)}
          title="Edit task"
          aria-label={`Edit task "${todo.title}"`}
        >
          <Edit2 size={15} />
        </button>

        <button
          type="button"
          className="icon-btn delete delete-todo-btn"
          onClick={() => onDelete(todo.id)}
          title="Delete task"
          aria-label={`Delete task "${todo.title}"`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
};
