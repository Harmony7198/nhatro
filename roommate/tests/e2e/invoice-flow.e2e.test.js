/**
 * @file invoice-flow.e2e.test.js
 * @description
 * E2E:
 * 1. Tạo phòng
 * 2. Tạo người thuê
 * 3. Tạo hợp đồng
 * 4. Ghi chỉ số điện nước
 * 5. Tạo hóa đơn
 * 6. Kiểm tra tổng tiền
 * 7. Kiểm tra trạng thái
 */

import { test, expect } from "@playwright/test";

test.describe("Invoice Flow", () => {

  test.beforeEach(async ({ page }) => {

    await page.goto("/");

    await page.evaluate(() => {

      localStorage.clear();

    });

    await page.reload();

  });

  test("Create invoice from complete workflow", async ({ page }) => {

    /*
     * ==================================================
     * 1. TẠO PHÒNG
     * ==================================================
     */

    await page.goto("#/rooms");

    await page.getByTestId("add-room").click();

    await page.getByTestId("room-code").fill("A101");

    await page.getByTestId("room-name").fill("Phòng A101");

    await page.getByTestId("room-area").fill("25");

    await page.getByTestId("room-rent-price").fill("3000000");

    await page.getByTestId("room-max-occupants").fill("4");

    await page.getByTestId("room-save-btn").click();

    await expect(page.getByText("A101")).toBeVisible();

    /*
     * ==================================================
     * 2. TẠO NGƯỜI THUÊ
     * ==================================================
     */

    await page.goto("#/tenants");

    await page.getByTestId("add-tenant").click();

    await page.getByTestId("tenant-full-name")
      .fill("Nguyễn Văn A");

    await page.getByTestId("tenant-phone-number")
      .fill("0909000000");

    await page.getByTestId("tenant-identity-number")
      .fill("012345678901");

    await page.getByTestId("tenant-email")
      .fill("a@gmail.com");

    await page.getByTestId("tenant-save-btn")
      .click();

    await expect(
      page.getByText("Nguyễn Văn A")
    ).toBeVisible();

    /*
     * ==================================================
     * 3. TẠO HỢP ĐỒNG
     * ==================================================
     */

    await page.goto("#/contracts");

    await page.getByTestId("add-contract").click();

    await page.getByTestId("contract-room")
      .selectOption({ label: /A101/ });

    await page.getByTestId("contract-representative")
      .selectOption({ label: /Nguyễn Văn A/ });

    await page.getByTestId("contract-tenants")
      .selectOption({ label: /Nguyễn Văn A/ });

    await page.getByTestId("contract-start-date")
      .fill("2026-07-01");

    await page.getByTestId("contract-end-date")
      .fill("2027-06-30");

    await page.getByTestId("contract-rent-price")
      .fill("3000000");

    await page.getByTestId("contract-deposit")
      .fill("3000000");

    await page.getByTestId("contract-save")
      .click();

    await expect(
      page.getByText("Đang hiệu lực")
    ).toBeVisible();

    /*
     * ==================================================
     * 4. GHI CHỈ SỐ
     * ==================================================
     */

    await page.goto("#/meter-readings");

    await page.getByTestId("add-reading").click();

    await page.getByTestId("meter-room")
      .selectOption({ label: /A101/ });

    await page.getByTestId("meter-month")
      .fill("2026-07");

    await page.getByTestId("electric-new")
      .fill("100");

    await page.getByTestId("water-new")
      .fill("20");

    await page.getByTestId("save-meter-reading")
      .click();

    await expect(page.getByText("100"))
      .toBeVisible();

    /*
     * ==================================================
     * 5. TẠO HÓA ĐƠN
     * ==================================================
     */

    await page.goto("#/invoices");

    await page.getByTestId("create-invoice")
      .click();

    await page.getByTestId("invoice-due-date")
      .fill("2026-07-15");

    await page.getByTestId("invoice-submit")
      .click();

    /*
     * ==================================================
     * 6. KIỂM TRA TIỀN
     * ==================================================
     *
     * Giả sử:
     *
     * Giá thuê = 3.000.000
     * Điện = 100 kWh × 3.500 = 350.000
     * Nước = 20 m3 × 15.000 = 300.000
     *
     * Tổng = 3.650.000
     *
     */

    const row =
      page.locator("tbody tr").first();

    await expect(
      row.getByText("3000000")
    ).toBeVisible();

    await expect(
      row.getByText("350000")
    ).toBeVisible();

    await expect(
      row.getByText("300000")
    ).toBeVisible();

    await expect(
      row.getByText("3650000")
    ).toBeVisible();

    /*
     * ==================================================
     * 7. KIỂM TRA TRẠNG THÁI
     * ==================================================
     */

    await expect(
      row.getByText("Chưa thanh toán")
    ).toBeVisible();

  });

});