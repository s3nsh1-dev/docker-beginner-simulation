import { Router } from 'express';
import { TodoController } from '../controllers/todoController.js';
import { validate, createTodoSchema, updateTodoSchema } from '../middleware/validator.js';

const router = Router();

// Stats route (must be before :id route)
router.get('/stats', TodoController.getStats);

// Bulk actions
router.delete('/completed/clear', TodoController.clearCompleted);

// CRUD routes
router.get('/', TodoController.getTodos);
router.get('/:id', TodoController.getTodoById);
router.post('/', validate(createTodoSchema), TodoController.createTodo);
router.patch('/:id', validate(updateTodoSchema), TodoController.updateTodo);
router.patch('/:id/toggle', TodoController.toggleTodo);
router.delete('/:id', TodoController.deleteTodo);

export default router;
