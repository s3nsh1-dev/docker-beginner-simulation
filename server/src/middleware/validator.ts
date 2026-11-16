import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255, 'Title must be 255 chars or less'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['work', 'personal', 'shopping', 'health', 'general']).optional(),
  due_date: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
      .nullable()
      .optional()
  ),
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255, 'Title must be 255 chars or less').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['work', 'personal', 'shopping', 'health', 'general']).optional(),
  due_date: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
      .nullable()
      .optional()
  ),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
      return;
    }
    req.body = result.data;
    next();
  };
};

