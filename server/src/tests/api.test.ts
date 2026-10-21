import assert from "node:assert/strict";
import { initDb } from "../config/db.js";
import { TodoModel } from "../models/todoModel.js";

async function runServerTests() {
  console.log(
    "Starting server integration tests against the disposable database...",
  );

  let createdId: number | undefined;
  let failed = false;

  try {
    await initDb();

    // 1. Create
    const title = `Test Todo ${Date.now()}`;
    const newTodo = await TodoModel.create({
      title,
      description: "Server test description",
      priority: "high",
      category: "work",
    });
    createdId = newTodo.id;
    assert.equal(newTodo.title, title, "Todo title mismatch after create");
    assert.equal(
      newTodo.priority,
      "high",
      "Todo priority mismatch after create",
    );
    console.log("PASS: create todo");

    // 2. Stats
    const stats = await TodoModel.getStats();
    assert.equal(typeof stats.total, "number", "Stats total is not a number");
    assert.ok(stats.total >= 1, "Stats should include the created todo");
    console.log("PASS: fetch stats");

    // 3. Toggle
    const toggled = await TodoModel.toggle(createdId);
    assert.equal(
      toggled?.completed,
      true,
      "Todo should be completed after toggle",
    );
    console.log("PASS: toggle todo");

    // 4. Delete
    const deleted = await TodoModel.delete(createdId);
    assert.equal(deleted, true, "Todo delete should return true");
    createdId = undefined; // cleanup already done — no row left behind
    console.log("PASS: delete todo");

    console.log("All server model & DB tests passed.");
  } catch (err) {
    failed = true;
    console.error("Server integration test failed:", err);
  } finally {
    // Runs on success AND failure: never leave test data behind.
    if (createdId !== undefined) {
      await TodoModel.delete(createdId).catch(() => {});
    }
  }

  process.exit(failed ? 1 : 0);
}

runServerTests();
