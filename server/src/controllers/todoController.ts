import type { Request, Response, NextFunction } from 'express';
import { TodoModel } from '../models/todoModel.js';
import type { TodoQueryParams } from '../types/todo.js';

export const TodoController = {
  async getTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams: TodoQueryParams = {
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
        completed: typeof req.query.completed === 'string' ? req.query.completed : undefined,
        priority: typeof req.query.priority === 'string' ? req.query.priority : undefined,
        category: typeof req.query.category === 'string' ? req.query.category : undefined,
        sortBy: typeof req.query.sortBy === 'string' ? (req.query.sortBy as any) : undefined,
        sortOrder: typeof req.query.sortOrder === 'string' ? (req.query.sortOrder as any) : undefined,
      };

      const todos = await TodoModel.getAll(queryParams);
      res.json(todos);
    } catch (error) {
      next(error);
    }
  },

  async getTodoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(String(paramId), 10);
      if (isNaN(id) || id <= 0 || id > 2147483647) {
        res.status(400).json({ message: 'Invalid ID parameter' });
        return;
      }

      const todo = await TodoModel.getById(id);
      if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
      }

      res.json(todo);
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await TodoModel.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  async createTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newTodo = await TodoModel.create(req.body);
      res.status(201).json(newTodo);
    } catch (error) {
      next(error);
    }
  },

  async updateTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(String(paramId), 10);
      if (isNaN(id) || id <= 0 || id > 2147483647) {
        res.status(400).json({ message: 'Invalid ID parameter' });
        return;
      }

      const updatedTodo = await TodoModel.update(id, req.body);
      if (!updatedTodo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
      }

      res.json(updatedTodo);
    } catch (error) {
      next(error);
    }
  },

  async toggleTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(String(paramId), 10);
      if (isNaN(id) || id <= 0 || id > 2147483647) {
        res.status(400).json({ message: 'Invalid ID parameter' });
        return;
      }

      const updatedTodo = await TodoModel.toggle(id);
      if (!updatedTodo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
      }

      res.json(updatedTodo);
    } catch (error) {
      next(error);
    }
  },

  async deleteTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(String(paramId), 10);
      if (isNaN(id) || id <= 0 || id > 2147483647) {
        res.status(400).json({ message: 'Invalid ID parameter' });
        return;
      }

      const deleted = await TodoModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Todo not found' });
        return;
      }

      res.json({ message: 'Todo deleted successfully', id });
    } catch (error) {
      next(error);
    }
  },

  async clearCompleted(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await TodoModel.clearCompleted();
      res.json({ message: `${count} completed todos cleared`, count });
    } catch (error) {
      next(error);
    }
  }
};
