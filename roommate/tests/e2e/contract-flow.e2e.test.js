import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();
});

test("Tạo phòng → tạo người thuê → tạo hợp đồng → kích hoạt", async ({
  page
}) => {

  /*
   * -----------------------
   * Tạo phòng
   * -----------------------
   */

  await page.goto("/#/rooms");

  await page.getByTestId("add-room").click();

  await page.getByTestId("room-code")
    .fill("P101");

  await page.getByTestId("room-name")
    .fill("Phòng 101");

  await page.getByTestId("room-rent-price")
    .fill("3000000");

  await page.getByTestId("save-room")
    .click();

  await expect(
    page.getByText("P101")
  ).toBeVisible();

  /*
   * -----------------------
   * Tạo người thuê
   * -----------------------
   */

  await page.goto("/#/tenants");

  await page.getByTestId("add-tenant")
    .click();

  await page.getByTestId("tenant-name")
    .fill("Nguyễn Văn A");

  await page.getByTestId("tenant-phone")
    .fill("0901234567");

  await page.getByTestId("tenant-id-number")
    .fill("123456789");

  await page.getByTestId("save-tenant")
    .click();

  await expect(
    page.getByText("Nguyễn Văn A")
  ).toBeVisible();

  /*
   * -----------------------
   * Tạo hợp đồng
   * -----------------------
   */

  await page.goto("/#/contracts");

  await page.getByTestId("add-contract")
    .click();

  await page.getByTestId("contract-number")
    .fill("HD001");

  await page.getByTestId("contract-room")
    .selectOption({ label: "P101" });

  await page.getByTestId("contract-tenant")
    .selectOption({ label: "Nguyễn Văn A" });

  await page.getByTestId("contract-start-date")
    .fill("2026-08-01");

  await page.getByTestId("contract-end-date")
    .fill("2027-07-31");

  await page.getByTestId("save-contract")
    .click();

  await expect(
    page.getByText("HD001")
  ).toBeVisible();

  /*
   * -----------------------
   * Kích hoạt
   * -----------------------
   */

  await page.getByTestId("activate-contract")
    .click();

  await page.getByRole("button", {
    name: /kích hoạt/i
  }).click();

  await expect(
    page.getByText("Hiệu lực")
  ).toBeVisible();

  /*
   * -----------------------
   * Kiểm tra phòng
   * -----------------------
   */

  await page.goto("/#/rooms");

  const row = page.locator("tr", {
    hasText: "P101"
  });

  await expect(row)
    .toContainText("Đang thuê");

  /*
   * -----------------------
   * Kiểm tra hợp đồng
   * -----------------------
   */

  await page.goto("/#/contracts");

  await expect(
    page.getByText("HD001")
  ).toBeVisible();
});

test("Không cho tạo hợp đồng trùng thời gian", async ({
  page
}) => {

  /*
   * Chuẩn bị dữ liệu
   */

  await page.goto("/#/rooms");

  // tạo phòng...

  await page.goto("/#/tenants");

  // tạo tenant...

  await page.goto("/#/contracts");

  /*
   * Hợp đồng thứ nhất
   */

  await page.getByTestId("add-contract")
    .click();

  await page.getByTestId("contract-number")
    .fill("HD001");

  await page.getByTestId("contract-room")
    .selectOption({ label: "P101" });

  await page.getByTestId("contract-tenant")
    .selectOption({ label: "Nguyễn Văn A" });

  await page.getByTestId("contract-start-date")
    .fill("2026-08-01");

  await page.getByTestId("contract-end-date")
    .fill("2026-12-31");

  await page.getByTestId("save-contract")
    .click();

  /*
   * Hợp đồng bị trùng
   */

  await page.getByTestId("add-contract")
    .click();

  await page.getByTestId("contract-number")
    .fill("HD002");

  await page.getByTestId("contract-room")
    .selectOption({ label: "P101" });

  await page.getByTestId("contract-tenant")
    .selectOption({ label: "Nguyễn Văn A" });

  await page.getByTestId("contract-start-date")
    .fill("2026-10-01");

  await page.getByTestId("contract-end-date")
    .fill("2027-03-31");

  await page.getByTestId("save-contract")
    .click();

  await expect(
    page.getByText(/trùng|đã có hợp đồng/i)
  ).toBeVisible();
});