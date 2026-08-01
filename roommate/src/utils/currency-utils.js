/**
 * @file currency-utils.js
 * @description Các hàm tiện ích xử lý tiền tệ cho RoomMate.
 */

const VIETNAMESE_LOCALE = "vi-VN";
const VIETNAMESE_CURRENCY = "VND";

/**
 * Định dạng số thành tiền Việt Nam.
 *
 * Ví dụ:
 * 1500000 -> "1.500.000 ₫"
 *
 * @param {number} amount
 * @returns {string}
 *
 * @throws {Error}
 */
export function formatCurrency(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    throw new Error("Số tiền phải là number hợp lệ.");
  }

  return new Intl.NumberFormat(VIETNAMESE_LOCALE, {
    style: "currency",
    currency: VIETNAMESE_CURRENCY,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Định dạng số thành chuỗi có dấu phân cách hàng nghìn.
 *
 * Ví dụ:
 * 1234567 -> "1.234.567"
 *
 * @param {number} value
 * @returns {string}
 *
 * @throws {Error}
 */
export function formatNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("Giá trị phải là number hợp lệ.");
  }

  return new Intl.NumberFormat(VIETNAMESE_LOCALE, {
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Chuyển chuỗi tiền nhập vào thành number.
 *
 * Ví dụ:
 * "1.500.000"
 * "1,500,000"
 * "1 500 000"
 * "1.500.000đ"
 *
 * => 1500000
 *
 * @param {string|number} value
 * @returns {number}
 *
 * @throws {Error}
 */
export function parseCurrency(value) {
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new Error("Giá trị không hợp lệ.");
    }

    return value;
  }

  if (typeof value !== "string") {
    throw new Error("Giá trị phải là chuỗi hoặc number.");
  }

  const normalized = value
    .trim()
    .replace(/[₫đ]/gi, "")
    .replace(/\s/g, "")
    .replace(/[.,]/g, "");

  if (!normalized) {
    throw new Error("Giá trị không được để trống.");
  }

  const number = Number(normalized);

  if (Number.isNaN(number)) {
    throw new Error("Không thể chuyển thành số.");
  }

  return number;
}

/**
 * Làm tròn tiền về số nguyên.
 *
 * @param {number} amount
 * @returns {number}
 *
 * @throws {Error}
 */
export function roundCurrency(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    throw new Error("Số tiền phải là number hợp lệ.");
  }

  return Math.round(amount);
}