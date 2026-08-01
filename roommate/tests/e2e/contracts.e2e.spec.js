import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();
});

test("Tạo hợp đồng và kích hoạt thành công", async ({ page }) => {

  // ===== TẠO PHÒNG =====

  await page.goto("#/rooms");

  await page.getByTestId("add-room").click();

  await page.getByTestId("room-code").fill("P101");
  await page.getByTestId("room-name").fill("Phòng 101");
  await page.getByTestId("room-area").fill("25");
  await page.getByTestId("room-rent-price").fill("2000000");
  await page.getByTestId("room-max-occupants").fill("3");
  await page.getByTestId("room-status").selectOption("AVAILABLE");

  await page.getByTestId("room-save-btn").click();

  await expect(page.getByText("P101")).toBeVisible();

  // ===== TẠO NGƯỜI THUÊ =====

  await page.goto("#/tenants");

  await page.getByTestId("add-tenant").click();

  await page
    .getByTestId("tenant-full-name")
    .fill("Nguyễn Văn A");

  await page
    .getByTestId("tenant-phone-number")
    .fill("0909123456");

  await page
    .getByTestId("tenant-identity-number")
    .fill("012345678901");

  await page
    .getByTestId("tenant-email")
    .fill("a@test.com");

  await page
    .getByTestId("tenant-save-btn")
    .click();

  await expect(
    page.getByText("Nguyễn Văn A")
  ).toBeVisible();

  // ===== TẠO HỢP ĐỒNG =====

  await page.goto("#/contracts");

  await page.getByTestId("add-contract").click();

  await page
    .getByTestId("contract-room")
    .selectOption({ label: /P101/i });

  await page
    .getByTestId("contract-representative")
    .selectOption({ label: /Nguyễn Văn A/i });

  await page
    .getByTestId("contract-tenants")
    .selectOption({ label: /Nguyễn Văn A/i });

  await page
    .getByTestId("contract-start-date")
    .fill("2026-08-01");

  await page
    .getByTestId("contract-end-date")
    .fill("2027-07-31");

  await page
    .getByTestId("contract-rent-price")
    .fill("2000000");

  await page
    .getByTestId("contract-deposit")
    .fill("2000000");

  await page
    .getByTestId("contract-save")
    .click();

  // ===== KÍCH HOẠT =====

  await page
    .locator("tr", {
      has: page.getByText("P101")
    })
    .getByTestId("activate-contract")
    .click();

  // ===== KIỂM TRA PHÒNG =====

  await page.goto("#/rooms");

  await expect(
    page
      .locator("tr", {
        has: page.getByText("P101")
      })
      .getByText("Đang thuê")
  ).toBeVisible();

  // ===== KIỂM TRA DANH SÁCH HỢP ĐỒNG =====

  await page.goto("#/contracts");

  await expect(
    page.getByText("P101")
  ).toBeVisible();

  await expect(
    page.getByText("Nguyễn Văn A")
  ).toBeVisible();

  await expect(
    page.getByText("Đang hiệu lực")
  ).toBeVisible();
});

test("Không cho tạo hợp đồng trùng thời gian", async ({ page }) => {

  // ===== TẠO PHÒNG =====

  await page.goto("#/rooms");

  await page.getByTestId("add-room").click();

  await page.getByTestId("room-code").fill("P201");
  await page.getByTestId("room-name").fill("Phòng 201");
  await page.getByTestId("room-area").fill("20");
  await page.getByTestId("room-rent-price").fill("1800000");
  await page.getByTestId("room-max-occupants").fill("2");
  await page.getByTestId("room-status").selectOption("AVAILABLE");

  await page.getByTestId("room-save-btn").click();

  // ===== TẠO NGƯỜI THUÊ =====

  await page.goto("#/tenants");

  await page.getByTestId("add-tenant").click();

  await page
    .getByTestId("tenant-full-name")
    .fill("Trần Thị B");

  await page
    .getByTestId("tenant-phone-number")
    .fill("0911222333");

  await page
    .getByTestId("tenant-identity-number")
    .fill("111122223333");

  await page
    .getByTestId("tenant-email")
    .fill("b@test.com");

  await page
    .getByTestId("tenant-save-btn")
    .click();

  // ===== HỢP ĐỒNG THỨ NHẤT =====

  await page.goto("#/contracts");

  await page.getByTestId("add-contract").click();

  await page
    .getByTestId("contract-room")
    .selectOption({ label: /P201/i });

  await page
    .getByTestId("contract-representative")
    .selectOption({ label: /Trần Thị B/i });

  await page
    .getByTestId("contract-tenants")
    .selectOption({ label: /Trần Thị B/i });

  await page
    .getByTestId("contract-start-date")
    .fill("2026-08-01");

  await page
    .getByTestId("contract-end-date")
    .fill("2027-07-31");

  await page
    .getByTestId("contract-rent-price")
    .fill("1800000");

  await page
    .getByTestId("contract-deposit")
    .fill("1800000");

  await page
    .getByTestId("contract-save")
    .click();

  // ===== HỢP ĐỒNG TRÙNG =====

  await page.getByTestId("add-contract").click();

  await page
    .getByTestId("contract-room")
    .selectOption({ label: /P201/i });

  await page
    .getByTestId("contract-representative")
    .selectOption({ label: /Trần Thị B/i });

  await page
    .getByTestId("contract-tenants")
    .selectOption({ label: /Trần Thị B/i });

  await page
    .getByTestId("contract-start-date")
    .fill("2027-01-01");

  await page
    .getByTestId("contract-end-date")
    .fill("2027-12-31");

  await page
    .getByTestId("contract-rent-price")
    .fill("1800000");

  await page
    .getByTestId("contract-deposit")
    .fill("1800000");

  await page
    .getByTestId("contract-save")
    .click();

  // ===== KIỂM TRA LỖI =====

  await expect(
    page.getByText(/trùng thời gian/i)
  ).toBeVisible();

  await expect(
    page.getByTestId("contract-room")
  ).toHaveClass(/is-invalid/);
});