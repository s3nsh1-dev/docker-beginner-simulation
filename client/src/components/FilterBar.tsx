import React from 'react';
import type { TodoFilterParams } from '../types/todo';
import { Search, Trash2, ArrowUpDown, X } from 'lucide-react';

interface FilterBarProps {
  filters: TodoFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<TodoFilterParams>>;
  onClearCompleted: () => void;
  completedCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  onClearCompleted,
  completedCount,
}) => {
  return (
    <div className="filter-bar-card glass-card">
      <div className="filter-row">
        {/* Search Input */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            id="filter-search-input"
            type="text"
            className="input-glass search-input"
            placeholder="Search tasks... (Press '/' to focus)"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          {filters.search && (
            <button
              className="icon-btn"
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="tabs-group">
          <button
            id="tab-all"
            className={`tab-btn ${filters.completed === 'all' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, completed: 'all' }))}
          >
            All
          </button>
          <button
            id="tab-active"
            className={`tab-btn ${filters.completed === 'false' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, completed: 'false' }))}
          >
            Active
          </button>
          <button
            id="tab-completed"
            className={`tab-btn ${filters.completed === 'true' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, completed: 'true' }))}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="filter-row">
        {/* Dropdowns */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Priority Select */}
          <select
            id="filter-priority-select"
            className="select-glass"
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🔵 Low</option>
          </select>

          {/* Category Select */}
          <select
            id="filter-category-select"
            className="select-glass"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="all">All Categories</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="shopping">🛒 Shopping</option>
            <option value="health">❤️ Health</option>
            <option value="general">📌 General</option>
          </select>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              id="filter-sort-select"
              className="select-glass"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            >
              <option value="created_at">Sort by Date Added</option>
              <option value="due_date">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <button
            id="btn-clear-completed"
            className="btn-danger"
            onClick={onClearCompleted}
            title="Clear all completed tasks"
          >
            <Trash2 size={15} />
            <span>Clear Completed ({completedCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};
