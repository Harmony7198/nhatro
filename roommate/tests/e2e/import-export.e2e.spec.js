import { test, expect } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();
});

test("Import / Export dữ liệu JSON", async ({
  page,
  context,
  tmpDir
}) => {
  //
  // =====================================================
  // 1. Chuẩn bị dữ liệu
  // =====================================================
  //

  await page.goto("#/rooms");

  await page.getByTestId("add-room").click();

  await page.getByTestId("room-code").fill("P901");
  await page.getByTestId("room-name").fill("Phòng Import");
  await page.getByTestId("room-area").fill("25");
  await page.getByTestId("room-rent-price").fill("2500000");
  await page.getByTestId("room-max-occupants").fill("2");
  await page.getByTestId("room-save-btn").click();

  await expect(
    page.getByText("P901")
  ).toBeVisible();

  //
  // =====================================================
  // 2. Export JSON
  // =====================================================
  //

  await page.goto("#/settings");

  const downloadPromise =
    page.waitForEvent("download");

  await page
    .getByTestId("export-json")
    .click();

  const download =
    await downloadPromise;

  //
  // =====================================================
  // 3. Kiểm tra download
  // =====================================================
  //

  expect(
    download.suggestedFilename()
  ).toMatch(/json/i);

  const exportedFile =
    `${tmpDir}/roommate-export.json`;

  await download.saveAs(exportedFile);

  expect(
    fs.existsSync(exportedFile)
  ).toBeTruthy();

  //
  // =====================================================
  // 4. Xóa dữ liệu
  // =====================================================
  //

  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();

  await page.goto("#/rooms");

  await expect(
    page.getByText("P901")
  ).not.toBeVisible();

  //
  // =====================================================
  // 5. Import lại
  // =====================================================
  //

  await page.goto("#/settings");

  const chooserPromise =
    page.waitForEvent("filechooser");

  await page
    .getByTestId("import-json")
    .click();

  const chooser =
    await chooserPromise;

  await chooser.setFiles(exportedFile);

  await expect(
    page.getByTestId("toast-success")
  ).toBeVisible();

  //
  // =====================================================
  // 6. Kiểm tra dữ liệu được khôi phục
  // =====================================================
  //

  await page.goto("#/rooms");

  await expect(
    page.getByText("P901")
  ).toBeVisible();

  //
  // =====================================================
  // Reload
  // =====================================================
  //

  await page.reload();

  await expect(
    page.getByText("P901")
  ).toBeVisible();

  //
  // =====================================================
  // 7. Import file sai định dạng
  // =====================================================
  //

  const invalidFile =
    `${tmpDir}/invalid.json`;

  fs.writeFileSync(
    invalidFile,
    "This is not JSON"
  );

  const chooser2 =
    page.waitForEvent(
      "filechooser"
    );

  await page
    .getByTestId("import-json")
    .click();

  (
    await chooser2
  ).setFiles(invalidFile);

  //
  // =====================================================
  // 8. Hiển thị lỗi
  // =====================================================
  //

  await expect(
    page.getByTestId("toast-danger")
  ).toContainText(
    /json|định dạng|lỗi/i
  );

  //
  // =====================================================
  // 9. Hủy ghi đè
  // =====================================================
  //

  const chooser3 =
    page.waitForEvent(
      "filechooser"
    );

  await page
    .getByTestId("import-json")
    .click();

  (
    await chooser3
  ).setFiles(exportedFile);

  await expect(
    page
      .getByTestId("confirm-dialog")
  ).toBeVisible();

  await page
    .getByTestId("confirm-cancel")
    .click();

  //
  // =====================================================
  // 10. Dữ liệu hiện tại không mất
  // =====================================================
  //

  await page.goto("#/rooms");

  await expect(
    page.getByText("P901")
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByText("P901")
  ).toBeVisible();

  //
  // LocalStorage vẫn còn dữ liệu
  //

  const rooms =
    await page.evaluate(() => {
      return JSON.parse(
        localStorage.getItem("rooms")
      );
    });

  expect(rooms.length).toBeGreaterThan(0);
});