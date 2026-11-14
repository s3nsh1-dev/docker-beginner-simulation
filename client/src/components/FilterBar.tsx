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
      {/* Primary Row: Search Input & Status Tabs */}
      <div className="filter-row filter-row-primary">
        <search className="search-box">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" aria-hidden="true" />
            <input
              id="filter-search-input"
              type="search"
              aria-label="Search tasks"
              className="input-glass search-input"
              placeholder="Search tasks... (Press '/' to focus)"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              autoComplete="off"
              spellCheck="false"
            />
            {filters.search && (
              <button
                type="button"
                className="icon-btn search-clear-btn"
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </search>

        {/* Status Filter Tabs */}
        <div className="tabs-group" role="tablist" aria-label="Task status filters">
          <button
            id="tab-all"
            type="button"
            role="tab"
            aria-selected={filters.completed === 'all'}
            className={`tab-btn ${filters.completed === 'all' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, completed: 'all' }))}
          >
            All
          </button>
          <button
            id="tab-active"
            type="button"
            role="tab"
            aria-selected={filters.completed === 'false'}
            className={`tab-btn ${filters.completed === 'false' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, completed: 'false' }))}
          >
            Active
          </button>
          <button
            id="tab-completed"
            type="button"
            role="tab"
            aria-selected={filters.completed === 'true'}
            className={`tab-btn ${filters.completed === 'true' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, completed: 'true' }))}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Secondary Row: Dropdowns & Clear Action */}
      <div className="filter-row filter-row-secondary">
        <div className="filter-controls-group">
          <select
            id="filter-priority-select"
            aria-label="Filter by priority"
            className="select-glass"
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            id="filter-category-select"
            aria-label="Filter by category"
            className="select-glass"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="all">All categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="general">General</option>
          </select>

          <div className="sort-select-wrapper">
            <ArrowUpDown size={13} className="sort-icon" aria-hidden="true" />
            <select
              id="filter-sort-select"
              aria-label="Sort tasks by"
              className="select-glass sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            >
              <option value="created_at">Date created</option>
              <option value="due_date">Due date</option>
              <option value="priority">Priority</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Clear Completed Action */}
        {completedCount > 0 && (
          <button
            id="btn-clear-completed"
            type="button"
            className="btn-danger"
            onClick={onClearCompleted}
            title="Clear all completed tasks"
          >
            <Trash2 size={13} />
            <span>Clear completed ({completedCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};
