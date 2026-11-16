import { pool } from '../config/db.js';
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoQueryParams, TodoStats, PriorityLevel } from '../types/todo.js';

export const TodoModel = {
  async getAll(params: TodoQueryParams): Promise<Todo[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (params.search && params.search.trim() !== '') {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      values.push(`%${params.search.trim()}%`);
      paramIndex++;
    }

    if (params.completed && params.completed !== 'all') {
      conditions.push(`completed = $${paramIndex}`);
      values.push(params.completed === 'true');
      paramIndex++;
    }

    if (params.priority && params.priority !== 'all') {
      conditions.push(`priority = $${paramIndex}`);
      values.push(params.priority);
      paramIndex++;
    }

    if (params.category && params.category !== 'all') {
      conditions.push(`category = $${paramIndex}`);
      values.push(params.category);
      paramIndex++;
    }

    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    const validSortFields = ['created_at', 'due_date', 'priority', 'title'];
    const sortBy = validSortFields.includes(params.sortBy || '') ? params.sortBy : 'created_at';
    const sortOrder = params.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const sortExpression = sortBy === 'priority'
      ? `CASE priority WHEN 'urgent' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END`
      : sortBy;

    const query = `
      SELECT * FROM todos
      ${whereClause}
      ORDER BY ${sortExpression} ${sortOrder} NULLS LAST
    `;

    const result = await pool.query(query, values);
    return result.rows;
  },

  async getById(id: number): Promise<Todo | null> {
    const query = `SELECT * FROM todos WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async create(data: CreateTodoInput): Promise<Todo> {
    const query = `
      INSERT INTO todos (title, description, priority, category, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description || '',
      data.priority || 'medium',
      data.category || 'general',
      data.due_date || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async update(id: number, data: UpdateTodoInput): Promise<Todo | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.completed !== undefined) {
      fields.push(`completed = $${paramIndex++}`);
      values.push(data.completed);
    }
    if (data.priority !== undefined) {
      fields.push(`priority = $${paramIndex++}`);
      values.push(data.priority);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramIndex++}`);
      values.push(data.category);
    }
    if (data.due_date !== undefined) {
      fields.push(`due_date = $${paramIndex++}`);
      values.push(data.due_date || null);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 1) {
      // Only updated_at is set, get existing
      return this.getById(id);
    }

    values.push(id);
    const query = `
      UPDATE todos
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  async toggle(id: number): Promise<Todo | null> {
    const query = `
      UPDATE todos
      SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM todos WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async clearCompleted(): Promise<number> {
    const query = `DELETE FROM todos WHERE completed = TRUE`;
    const result = await pool.query(query);
    return result.rowCount ?? 0;
  },

  async getStats(): Promise<TodoStats> {
    const totalResult = await pool.query(`
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE completed = true)::int as completed,
        COUNT(*) FILTER (WHERE completed = false)::int as pending
      FROM todos
    `);

    const priorityResult = await pool.query(`
      SELECT priority, COUNT(*)::int as count
      FROM todos
      GROUP BY priority
    `);

    const categoryResult = await pool.query(`
      SELECT category, COUNT(*)::int as count
      FROM todos
      GROUP BY category
    `);

    const total = totalResult.rows[0]?.total || 0;
    const completed = totalResult.rows[0]?.completed || 0;
    const pending = totalResult.rows[0]?.pending || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byPriority: Record<PriorityLevel, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    priorityResult.rows.forEach((row: { priority: PriorityLevel; count: number }) => {
      if (row.priority in byPriority) {
        byPriority[row.priority] = row.count;
      }
    });

    const byCategory: Record<string, number> = {};
    categoryResult.rows.forEach((row: { category: string; count: number }) => {
      byCategory[row.category] = row.count;
    });

    return {
      total,
      completed,
      pending,
      completionRate,
      byPriority,
      byCategory,
    };
  }
};
