import { initDb } from '../config/db.js';
import { TodoModel } from '../models/todoModel.js';

async function runServerTests() {
  console.log('🧪 Starting Server Integration Tests...');

  try {
    await initDb();

    // 1. Create Todo Test
    const title = `Test Todo ${Date.now()}`;
    const newTodo = await TodoModel.create({
      title,
      description: 'Server test description',
      priority: 'high',
      category: 'work',
    });
    console.assert(newTodo.title === title, '❌ Test Failed: Todo title mismatch');
    console.assert(newTodo.priority === 'high', '❌ Test Failed: Todo priority mismatch');
    console.log('✅ PASS: Create Todo Model Test');

    // 2. Fetch Stats Test
    const stats = await TodoModel.getStats();
    console.assert(typeof stats.total === 'number', '❌ Test Failed: Stats total is invalid');
    console.log('✅ PASS: Get Stats Model Test');

    // 3. Toggle Todo Test
    const toggled = await TodoModel.toggle(newTodo.id);
    console.assert(toggled?.completed === true, '❌ Test Failed: Todo toggle state mismatch');
    console.log('✅ PASS: Toggle Todo Model Test');

    // 4. Delete Todo Test
    const deleted = await TodoModel.delete(newTodo.id);
    console.assert(deleted === true, '❌ Test Failed: Delete Todo failed');
    console.log('✅ PASS: Delete Todo Model Test');

    console.log('🎉 All Server Model & DB Tests Passed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Server Integration Test Error:', err);
    process.exit(1);
  }
}

runServerTests();
