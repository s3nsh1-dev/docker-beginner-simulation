import { useState, useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { QuickAdd } from './components/QuickAdd';
import { FilterBar } from './components/FilterBar';
import { TodoCard } from './components/TodoCard';
import { EmptyState } from './components/EmptyState';
import { TodoModal } from './components/TodoModal';
import type { Todo, CreateTodoInput } from './types/todo';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import './index.css';

export default function App() {
  const {
    todos,
    stats,
    loading,
    error,
    toastMessage,
    filters,
    setFilters,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Theme & Accent state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('taskpulse_theme') as 'dark' | 'light') || 'dark';
  });

  const [accent, setAccent] = useState<'cyan' | 'emerald' | 'rose' | 'amber'>(() => {
    return (localStorage.getItem('taskpulse_accent') as any) || 'cyan';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskpulse_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('taskpulse_accent', accent);
  }, [accent]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when inside inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === '/' || e.key === 's') {
        e.preventDefault();
        document.getElementById('filter-search-input')?.focus();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleOpenCreateModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  const handleQuickAdd = async (input: CreateTodoInput) => {
    await createTodo(input);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const completedCount = stats?.completed || 0;

  return (
    <div className="app-container">
      {/* Header with Theme Toggle & Accent Selector */}
      <Header
        onOpenModal={handleOpenCreateModal}
        pendingCount={stats?.pending}
        theme={theme}
        onToggleTheme={toggleTheme}
        accent={accent}
        onChangeAccent={setAccent}
      />

      {/* Hero Stats Dashboard with SVG Progress Ring */}
      <StatsDashboard stats={stats} />

      {/* Quick Add Bar */}
      <QuickAdd onAdd={handleQuickAdd} />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onClearCompleted={clearCompleted}
        completedCount={completedCount}
      />

      {/* Error Alert Banner */}
      {error && (
        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            marginBottom: '24px',
            borderColor: 'rgba(244, 63, 94, 0.4)',
            background: 'rgba(244, 63, 94, 0.12)',
            color: '#fda4af',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <AlertTriangle size={20} />
          <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>
        </div>
      )}

      {/* Main Todo List Grid */}
      {loading ? (
        <div
          className="glass-card"
          style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}
        >
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '14px', fontSize: '0.95rem' }}>Syncing tasks with database...</p>
        </div>
      ) : todos.length === 0 ? (
        <EmptyState
          filterType={filters.completed}
          onOpenModal={handleOpenCreateModal}
        />
      ) : (
        <div className="todo-list-grid">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={handleOpenEditModal}
              onDelete={deleteTodo}
            />
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <TodoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitCreate={createTodo}
        onSubmitUpdate={updateTodo}
        editingTodo={editingTodo}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
