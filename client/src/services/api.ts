import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilterParams, TodoStats } from '../types/todo';

const API_BASE = 'http://localhost:5000/api/todos';

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} Error`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // fallback
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

export const todoApi = {
  async getTodos(filters: TodoFilterParams): Promise<Todo[]> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.completed !== 'all') params.append('completed', filters.completed);
    if (filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<Todo[]>(queryString);
  },

  async getTodoById(id: number): Promise<Todo> {
    return request<Todo>(`/${id}`);
  },

  async getStats(): Promise<TodoStats> {
    return request<TodoStats>('/stats');
  },

  async createTodo(data: CreateTodoInput): Promise<Todo> {
    return request<Todo>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTodo(id: number, data: UpdateTodoInput): Promise<Todo> {
    return request<Todo>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async toggleTodo(id: number): Promise<Todo> {
    return request<Todo>(`/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteTodo(id: number): Promise<{ message: string; id: number }> {
    return request<{ message: string; id: number }>(`/${id}`, {
      method: 'DELETE',
    });
  },

  async clearCompleted(): Promise<{ message: string; count: number }> {
    return request<{ message: string; count: number }>('/completed/clear', {
      method: 'DELETE',
    });
  },
};
