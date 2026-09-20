import { useState, useEffect, useCallback } from 'react';
import type { Todo, TodoFilterParams, TodoStats, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { todoApi } from '../services/api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<TodoFilterParams>({
    search: '',
    completed: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchStats = useCallback(async () => {
    try {
      const data = await todoApi.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoApi.getTodos(filters);
      setTodos(data);
      await fetchStats();
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, [filters, fetchStats]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (input: CreateTodoInput) => {
    try {
      const created = await todoApi.createTodo(input);
      showToast(`Task "${created.title}" created successfully!`);
      await fetchTodos();
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
      throw err;
    }
  };

  const updateTodo = async (id: number, input: UpdateTodoInput) => {
    try {
      const updated = await todoApi.updateTodo(id, input);
      showToast(`Task updated successfully!`);
      await fetchTodos();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
      throw err;
    }
  };

  const toggleTodo = async (id: number) => {
    // Optimistic UI update
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await todoApi.toggleTodo(id);
      showToast(updated.completed ? 'Task completed! 🎉' : 'Task marked active');
      await fetchStats();
    } catch (err: any) {
      // Revert if error
      await fetchTodos();
      setError(err.message || 'Failed to toggle status');
    }
  };

  const deleteTodo = async (id: number) => {
    // Optimistic UI delete
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await todoApi.deleteTodo(id);
      showToast('Task deleted');
      await fetchStats();
    } catch (err: any) {
      await fetchTodos();
      setError(err.message || 'Failed to delete task');
    }
  };

  const clearCompleted = async () => {
    try {
      const result = await todoApi.clearCompleted();
      showToast(result.message);
      await fetchTodos();
    } catch (err: any) {
      setError(err.message || 'Failed to clear completed tasks');
    }
  };

  return {
    todos,
    stats,
    loading,
    error,
    toastMessage,
    filters,
    setFilters,
    fetchTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
}
