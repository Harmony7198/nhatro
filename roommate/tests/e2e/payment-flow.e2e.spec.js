import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();
});

test("Thanh toán một phần rồi thanh toán hết hóa đơn", async ({ page }) => {
  //
  // =====================================================
  // Chuẩn bị dữ liệu
  // =====================================================
  //

  // ---------- Phòng ----------

  await page.goto("#/rooms");

  await page.getByTestId("add-room").click();

  await page.getByTestId("room-code").fill("P501");
  await page.getByTestId("room-name").fill("Phòng 501");
  await page.getByTestId("room-area").fill("25");
  await page.getByTestId("room-rent-price").fill("2000000");
  await page.getByTestId("room-max-occupants").fill("2");
  await page.getByTestId("room-status").selectOption("AVAILABLE");

  await page.getByTestId("room-save-btn").click();

  // ---------- Người thuê ----------

  await page.goto("#/tenants");

  await page.getByTestId("add-tenant").click();

  await page.getByTestId("tenant-full-name").fill("Nguyễn Văn Test");
  await page.getByTestId("tenant-phone-number").fill("0909000000");
  await page.getByTestId("tenant-identity-number").fill("079999999999");
  await page.getByTestId("tenant-email").fill("payment@test.com");

  await page.getByTestId("tenant-save-btn").click();

  // ---------- Hợp đồng ----------

  await page.goto("#/contracts");

  await page.getByTestId("add-contract").click();

  await page
    .getByTestId("contract-room")
    .selectOption({ label: /P501/i });

  await page
    .getByTestId("contract-representative")
    .selectOption({ label: /Nguyễn Văn Test/i });

  await page
    .getByTestId("contract-tenants")
    .selectOption({ label: /Nguyễn Văn Test/i });

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

  await page.getByTestId("contract-save").click();

  await page
    .locator("tr", {
      has: page.getByText("P501")
    })
    .getByTestId("activate-contract")
    .click();

  // ---------- Chỉ số ----------

  await page.goto("#/meter-readings");

  await page.getByTestId("add-reading").click();

  await page
    .getByTestId("meter-room")
    .selectOption({ label: /P501/i });

  await page
    .getByTestId("meter-month")
    .fill("2026-08");

  await page.locator("#electric-old-index").fill("100");
  await page.getByTestId("electric-new").fill("150");

  await page.locator("#water-old-index").fill("20");
  await page.getByTestId("water-new").fill("30");

  await page
    .getByTestId("save-meter-reading")
    .click();

  // ---------- Tạo hóa đơn ----------

  await page.goto("#/invoices");

  await page
    .getByTestId("create-invoice")
    .click();

  await page
    .getByTestId("invoice-due-date")
    .fill("2026-08-10");

  await page
    .getByTestId("invoice-submit")
    .click();

  //
  // =====================================================
  // 1. Hóa đơn chưa thanh toán
  // =====================================================
  //

  const invoiceRow = page.locator("tr", {
    has: page.getByText("P501")
  });

  await expect(
    invoiceRow.getByText(/Chưa thanh toán/i)
  ).toBeVisible();

  await expect(
    invoiceRow.getByText("2.375.000")
  ).toBeVisible();

  //
  // =====================================================
  // 2. Thanh toán 1 phần
  // =====================================================
  //

  await invoiceRow
    .getByTestId("pay-invoice")
    .click();

  await page
    .getByTestId("payment-amount")
    .fill("1200000");

  await page
    .getByTestId("payment-save")
    .click();

  //
  // =====================================================
  // 3. Kiểm tra còn nợ
  // =====================================================
  //

  await expect(
    invoiceRow.getByText("1.175.000")
  ).toBeVisible();

  await expect(
    invoiceRow.getByText(/Thanh toán một phần/i)
  ).toBeVisible();

  //
  // =====================================================
  // 4. Thanh toán phần còn lại
  // =====================================================
  //

  await invoiceRow
    .getByTestId("pay-invoice")
    .click();

  await page
    .getByTestId("payment-amount")
    .fill("1175000");

  await page
    .getByTestId("payment-save")
    .click();

  //
  // =====================================================
  // 5. Đã thanh toán
  // =====================================================
  //

  await expect(
    invoiceRow.getByText(/Đã thanh toán/i)
  ).toBeVisible();

  await expect(
    invoiceRow.getByText("0")
  ).toBeVisible();

  //
  // =====================================================
  // Reload
  // =====================================================
  //

  await page.reload();

  const invoiceReload = page.locator("tr", {
    has: page.getByText("P501")
  });

  await expect(
    invoiceReload.getByText(/Đã thanh toán/i)
  ).toBeVisible();

  await expect(
    invoiceReload.getByText("0")
  ).toBeVisible();

  //
  // =====================================================
  // 6. Dashboard
  // =====================================================
  //

  await page.goto("#/dashboard");

  //
  // =====================================================
  // 7. Kiểm tra doanh thu / tiền thực thu
  // =====================================================
  //

  await expect(
    page.getByTestId("dashboard-revenue")
  ).toContainText("2.375.000");

  await expect(
    page.getByTestId("dashboard-collected")
  ).toContainText("2.375.000");

  //
  // =====================================================
  // 8. Công nợ giảm
  // =====================================================
  //

  await expect(
    page.getByTestId("dashboard-debt")
  ).toContainText("0");

  //
  // =====================================================
  // Reload Dashboard
  // =====================================================
  //

  await page.reload();

  await expect(
    page.getByTestId("dashboard-collected")
  ).toContainText("2.375.000");

  await expect(
    page.getByTestId("dashboard-debt")
  ).toContainText("0");
});