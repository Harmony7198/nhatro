/**
 * @file room-page.spec.js
 * @description Playwright E2E - Quản lý phòng.
 */

import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.reload();
});

test("Quản lý phòng đầy đủ", async ({ page }) => {
  // Mở trang phòng
  await page.goto("/#/rooms");

  await expect(
    page.getByTestId("rooms-title")
  ).toBeVisible();

  // Thêm phòng mới
  await page.getByTestId("add-room").click();

  await page.getByTestId("room-code").fill("A101");
  await page.getByTestId("room-name").fill("Phòng A101");
  await page.getByTestId("room-floor").fill("1");
  await page.getByTestId("room-area").fill("25");
  await page.getByTestId("room-rent-price").fill("3000000");

  await page.getByTestId("room-status").selectOption("available");

  await page.getByTestId("save-room").click();

  // Kiểm tra xuất hiện
  await expect(page.locator("tbody")).toContainText("A101");
  await expect(page.locator("tbody")).toContainText("3.000.000");

  // Reload
  await page.reload();

  // Dữ liệu vẫn còn
  await expect(page.locator("tbody")).toContainText("A101");

  // Sửa giá phòng
  await page
    .locator("tr", {
      hasText: "A101"
    })
    .getByTestId("edit-room")
    .click();

  await page.getByTestId("room-rent-price").fill("3500000");

  await page.getByTestId("save-room").click();

  await expect(page.locator("tbody")).toContainText("3.500.000");

  // Tìm kiếm
  await page.getByTestId("room-search").fill("A101");

  await expect(page.locator("tbody")).toContainText("A101");

  // Lọc trạng thái
  await page
    .getByTestId("room-status-filter")
    .selectOption("available");

  await expect(page.locator("tbody")).toContainText("A101");

  // Xóa phòng
  await page
    .locator("tr", {
      hasText: "A101"
    })
    .getByTestId("delete-room")
    .click();

  await page
    .getByRole("button", {
      name: /xác nhận|đồng ý|xóa/i
    })
    .click();

  // Kiểm tra biến mất
  await expect(page.locator("tbody")).not.toContainText("A101");
});