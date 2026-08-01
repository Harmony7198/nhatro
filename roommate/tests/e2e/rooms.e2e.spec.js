import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();
});

test("Quản lý phòng", async ({ page }) => {

  // 1. Mở trang phòng

  await page.goto("#/rooms");

  await expect(
    page.getByTestId("rooms-title")
  ).toBeVisible();

  // 2. Thêm phòng mới

  await page
    .getByTestId("add-room")
    .click();

  await page
    .getByTestId("room-code")
    .fill("P101");

  await page
    .getByTestId("room-name")
    .fill("Phòng 101");

  await page
    .getByTestId("room-area")
    .fill("25");

  await page
    .getByTestId("room-rent-price")
    .fill("2500000");

  await page
    .getByTestId("room-max-occupants")
    .fill("3");

  await page
    .getByTestId("room-status")
    .selectOption("AVAILABLE");

  await page
    .getByTestId("room-save-btn")
    .click();

  // 3. Kiểm tra phòng xuất hiện

  await expect(
    page.getByText("P101")
  ).toBeVisible();

  await expect(
    page.getByText("Phòng 101")
  ).toBeVisible();

  await expect(
    page.getByText("2,500,000")
  ).toBeVisible();

  // 4. Reload

  await page.reload();

  // 5. Kiểm tra vẫn còn

  await expect(
    page.getByText("P101")
  ).toBeVisible();

  await expect(
    page.getByText("Phòng 101")
  ).toBeVisible();

  // 6. Sửa giá phòng

  await page
    .locator("tr", {
      has: page.getByText("P101")
    })
    .getByTestId("edit-room")
    .click();

  const rentInput =
    page.getByTestId("room-rent-price");

  await rentInput.fill("3000000");

  await page
    .getByTestId("room-save-btn")
    .click();

  await expect(
    page.getByText("3,000,000")
  ).toBeVisible();

  // 7. Tìm kiếm

  await page
    .getByTestId("room-search")
    .fill("P101");

  await expect(
    page.getByText("P101")
  ).toBeVisible();

  // 8. Lọc trạng thái

  await page
    .getByTestId("room-status-filter")
    .selectOption("AVAILABLE");

  await expect(
    page.getByText("P101")
  ).toBeVisible();

  // 9. Xóa phòng

  await page
    .locator("tr", {
      has: page.getByText("P101")
    })
    .getByTestId("delete-room")
    .click();

  await page
    .getByTestId("confirm-button")
    .click();

  // 10. Kiểm tra đã biến mất

  await expect(
    page.getByText("P101")
  ).toHaveCount(0);

});