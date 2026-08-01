import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();
});

test("Tạo hóa đơn từ hợp đồng và kiểm tra tổng tiền", async ({ page }) => {
  //
  // ===============================
  // 1. TẠO PHÒNG
  // ===============================
  //

  await page.goto("#/rooms");

  await page.getByTestId("add-room").click();

  await page.getByTestId("room-code").fill("P101");
  await page.getByTestId("room-name").fill("Phòng 101");
  await page.getByTestId("room-area").fill("20");
  await page.getByTestId("room-rent-price").fill("2000000");
  await page.getByTestId("room-max-occupants").fill("2");
  await page.getByTestId("room-status").selectOption("AVAILABLE");

  await page.getByTestId("room-save-btn").click();

  await expect(page.getByText("P101")).toBeVisible();

  //
  // ===============================
  // 2. TẠO NGƯỜI THUÊ
  // ===============================
  //

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

  //
  // ===============================
  // 3. TẠO HỢP ĐỒNG
  // ===============================
  //

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

  await page.getByTestId("contract-save").click();

  //
  // ===============================
  // 4. KÍCH HOẠT HỢP ĐỒNG
  // ===============================
  //

  await page
    .locator("tr", {
      has: page.getByText("P101")
    })
    .getByTestId("activate-contract")
    .click();

  //
  // ===============================
  // 5. GHI CHỈ SỐ
  // ===============================
  //
  // Điện:
  // cũ 100
  // mới 150
  // => 50 kWh
  //
  // Nước:
  // cũ 20
  // mới 30
  // => 10 m3
  //

  await page.goto("#/meter-readings");

  await page.getByTestId("add-reading").click();

  await page
    .getByTestId("meter-room")
    .selectOption({ label: /P101/i });

  await page
    .getByTestId("meter-month")
    .fill("2026-08");

  await page
    .locator("#electric-old-index")
    .fill("100");

  await page
    .getByTestId("electric-new")
    .fill("150");

  await page
    .locator("#water-old-index")
    .fill("20");

  await page
    .getByTestId("water-new")
    .fill("30");

  await page
    .getByTestId("save-meter-reading")
    .click();

  await expect(page.getByText("50")).toBeVisible();
  await expect(page.getByText("10")).toBeVisible();

  //
  // ===============================
  // 6. TẠO HÓA ĐƠN
  // ===============================
  //

  await page.goto("#/invoices");

  await page
    .getByTestId("create-invoice")
    .click();

  await page
    .getByTestId("invoice-room-input")
    .fill("P101");

  await page
    .getByTestId("invoice-month-input")
    .fill("2026-08");

  await page
    .getByTestId("invoice-due-date")
    .fill("2026-08-10");

  await page
    .getByTestId("invoice-discount")
    .fill("0");

  await page
    .getByTestId("invoice-submit")
    .click();

  //
  // ===============================
  // 7. KIỂM TRA CHI TIẾT HÓA ĐƠN
  // ===============================
  //
  // Giả sử:
  //
  // Giá thuê:
  // 2.000.000
  //
  // Điện:
  // 50 × 3.500 = 175.000
  //
  // Nước:
  // 10 × 20.000 = 200.000
  //
  // Tổng:
  // 2.375.000
  //

  const row = page.locator("tr", {
    has: page.getByText("P101")
  });

  await expect(
    row.getByText("2.000.000")
  ).toBeVisible();

  await expect(
    row.getByText("175.000")
  ).toBeVisible();

  await expect(
    row.getByText("200.000")
  ).toBeVisible();

  await expect(
    row.getByText("2.375.000")
  ).toBeVisible();

  //
  // ===============================
  // 8. TRẠNG THÁI
  // ===============================
  //

  await expect(
    row.getByText(/Chưa thanh toán/i)
  ).toBeVisible();
});