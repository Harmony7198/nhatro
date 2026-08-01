/**
 * @file number-utils.js
 * @description Các hàm tiện ích xử lý số cho RoomMate.
 */

/**
 * Chuyển giá trị về number an toàn.
 *
 * Hỗ trợ:
 * - number
 * - string
 *
 * Ví dụ:
 * "100" => 100
 * "10.5" => 10.5
 * "" => Error
 *
 * @param {number|string} value
 * @returns {number}
 *
 * @throws {Error}
 */
export function toSafeNumber(value) {
  if (typeof value === "number") {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      throw new Error("Giá trị số không hợp lệ.");
    }

    return value;
  }

  if (typeof value !== "string") {
    throw new Error("Giá trị phải là number hoặc string.");
  }

  const text = value.trim();

  if (!text) {
    throw new Error("Giá trị không được để trống.");
  }

  const number = Number(text);

  if (Number.isNaN(number) || !Number.isFinite(number)) {
    throw new Error("Không thể chuyển thành số.");
  }

  return number;
}

/**
 * Kiểm tra số không âm.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonNegativeNumber(value) {
  if (typeof value !== "number") {
    return false;
  }

  return Number.isFinite(value) && value >= 0;
}

/**
 * Giới hạn giá trị trong khoảng min và max.
 *
 * Ví dụ:
 * clamp(15, 0, 10) => 10
 * clamp(-2, 0, 10) => 0
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 *
 * @throws {Error}
 */
export function clamp(value, min, max) {
  const safeValue = toSafeNumber(value);
  const safeMin = toSafeNumber(min);
  const safeMax = toSafeNumber(max);

  if (safeMin > safeMax) {
    throw new Error("min không được lớn hơn max.");
  }

  return Math.min(Math.max(safeValue, safeMin), safeMax);
}

/**
 * Làm tròn số theo số chữ số thập phân.
 *
 * Ví dụ:
 * roundTo(12.3456, 2) => 12.35
 *
 * @param {number} value
 * @param {number} decimalPlaces
 * @returns {number}
 *
 * @throws {Error}
 */
export function roundTo(value, decimalPlaces = 0) {
  const safeValue = toSafeNumber(value);

  if (
    !Number.isInteger(decimalPlaces) ||
    decimalPlaces < 0
  ) {
    throw new Error(
      "decimalPlaces phải là số nguyên không âm."
    );
  }

  const factor = 10 ** decimalPlaces;

  return Math.round(safeValue * factor) / factor;
}

/**
 * Tính tổng các số.
 *
 * Ví dụ:
 * sumNumbers([1,2,3]) => 6
 *
 * @param {number[]} values
 * @returns {number}
 *
 * @throws {Error}
 */
export function sumNumbers(values) {
  if (!Array.isArray(values)) {
    throw new Error("Đầu vào phải là mảng.");
  }

  return values.reduce((total, value) => {
    return total + toSafeNumber(value);
  }, 0);
}