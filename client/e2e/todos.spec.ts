import { test, expect } from "@playwright/test";

test.describe("TaskPulse Client E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the app header and stats overview", async ({ page }) => {
    await expect(page.locator(".logo-title")).toHaveText("TaskPulse");
    await expect(page.locator("#stat-total")).toBeVisible();
    await expect(page.locator("#stat-completed")).toBeVisible();
    await expect(page.locator("#stat-pending")).toBeVisible();
  });

  test("should quick add a new task and toggle completion", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const taskTitle = `Quick Task ${timestamp}`;

    const quickInput = page.locator("#quick-todo-input");
    await quickInput.fill(taskTitle);
    await page.click("#btn-quick-add");

    const todoCard = page.locator(".todo-card", { hasText: taskTitle });
    await expect(todoCard).toBeVisible();

    const checkbox = todoCard.locator(".checkbox-custom");
    await checkbox.click();

    await expect(todoCard).toHaveClass(/completed/);

    const deleteBtn = todoCard.locator(".delete-todo-btn");
    await deleteBtn.click();
    await expect(todoCard).not.toBeVisible();
  });

  test("should create a detailed task using modal dialog", async ({ page }) => {
    const timestamp = Date.now();
    const modalTitle = `Modal Task ${timestamp}`;

    await page.click("#btn-create-task");
    await expect(page.locator(".modal-content")).toBeVisible();

    await page.fill("#modal-todo-title", modalTitle);
    await page.fill("#modal-todo-desc", "Automated E2E test description");
    await page.selectOption("#modal-todo-priority", "urgent");
    await page.selectOption("#modal-todo-category", "work");

    await page.click("#modal-submit-btn");

    const todoCard = page.locator(".todo-card", { hasText: modalTitle });
    await expect(todoCard).toBeVisible();

    await todoCard.locator(".delete-todo-btn").click();
    await expect(todoCard).not.toBeVisible();
  });

  test("should filter tasks by search input and status tabs", async ({
    page,
  }) => {
    const uniqueId = Date.now();
    const taskA = `Alpha Task ${uniqueId}`;
    const taskB = `Beta Task ${uniqueId}`;

    await page.fill("#quick-todo-input", taskA);
    await page.click("#btn-quick-add");

    await page.fill("#quick-todo-input", taskB);
    await page.click("#btn-quick-add");

    const cardA = page.locator(".todo-card", { hasText: taskA });
    await cardA.locator(".checkbox-custom").click();

    await page.click("#tab-completed");
    await expect(page.locator(".todo-card", { hasText: taskA })).toBeVisible();
    await expect(
      page.locator(".todo-card", { hasText: taskB }),
    ).not.toBeVisible();

    await page.click("#tab-active");
    await expect(page.locator(".todo-card", { hasText: taskB })).toBeVisible();
    await expect(
      page.locator(".todo-card", { hasText: taskA }),
    ).not.toBeVisible();

    await page.click("#tab-all");

    await page.fill("#filter-search-input", "Alpha");
    await expect(page.locator(".todo-card", { hasText: taskA })).toBeVisible();
    await expect(
      page.locator(".todo-card", { hasText: taskB }),
    ).not.toBeVisible();

    await page.fill("#filter-search-input", "");

    await cardA.locator(".delete-todo-btn").click();
    const cardB = page.locator(".todo-card", { hasText: taskB });
    await cardB.locator(".delete-todo-btn").click();
  });
});
