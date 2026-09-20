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
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (todo.completed) {
      return { text: due.toLocaleDateString(), isOverdue: false };
    }

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due Today', isOverdue: false, isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', isOverdue: false };
    } else {
      return { text: `Due in ${diffDays} days`, isOverdue: false };
    }
  };

  const dueStatus = getDueStatus(todo.due_date);

  const getPriorityDot = (p: string) => {
    switch (p) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      default: return '🔵';
    }
  };

  return (
    <div
      className={`todo-card glass-card ${todo.completed ? 'completed' : ''}`}
      data-testid={`todo-card-${todo.id}`}
    >
      {/* Animated Checkbox */}
      <div
        className={`checkbox-custom ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        role="checkbox"
        aria-checked={todo.completed}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(todo.id);
          }
        }}
      >
        {todo.completed && <Check size={14} />}
      </div>

      {/* Main Content */}
      <div className="todo-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={`todo-title ${todo.completed ? 'strikethrough' : ''}`}>
            {todo.title}
          </div>

          {todo.description && (
            <button
              className="icon-btn"
              onClick={() => setExpanded(!expanded)}
              style={{ padding: '4px' }}
              title={expanded ? 'Collapse details' : 'Expand details'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>

        {/* Description */}
        {todo.description && (expanded || todo.description.length < 90) && (
          <div className="todo-desc">{todo.description}</div>
        )}

        <div className="todo-meta">
          {/* Priority Badge */}
          <span className={`badge badge-${todo.priority}`}>
            <span>{getPriorityDot(todo.priority)}</span>
            <span>{todo.priority}</span>
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
                  ? { color: '#f43f5e', background: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.3)' }
                  : dueStatus.isToday
                  ? { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }
                  : {}
              }
            >
              {dueStatus.isOverdue ? <AlertCircle size={13} /> : <Calendar size={13} />}
              <span>{dueStatus.text}</span>
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="action-buttons">
        <button
          className="icon-btn edit-todo-btn"
          onClick={() => onEdit(todo)}
          title="Edit Task"
        >
          <Edit2 size={16} />
        </button>

        <button
          className="icon-btn delete delete-todo-btn"
          onClick={() => onDelete(todo.id)}
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
