export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'general';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: PriorityLevel;
  category: Category;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  category?: Category;
  due_date?: string | null;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: PriorityLevel;
  category?: Category;
  due_date?: string | null;
}

export interface TodoFilterParams {
  search: string;
  completed: string; // 'all' | 'true' | 'false'
  priority: string;  // 'all' | 'low' | 'medium' | 'high' | 'urgent'
  category: string;  // 'all' | 'work' | 'personal' | 'shopping' | 'health' | 'general'
  sortBy: 'created_at' | 'due_date' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byPriority: Record<PriorityLevel, number>;
  byCategory: Record<string, number>;
}
