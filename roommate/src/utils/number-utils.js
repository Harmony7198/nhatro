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
  if (
    !isNumber(value) ||
    !isNumber(min) ||
    !isNumber(max)
  ) {
    throw new Error(
      "Các tham số phải là number."
    );
  }

  if (min > max) {
    throw new Error(
      "min không được lớn hơn max."
    );
  }

  return Math.min(
    Math.max(value, min),
    max
  );
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
    if (!isNumber(value)) {
      throw new Error(
        "Mọi phần tử phải là number."
      );
    }

    return total + value;
  }, 0);
}

/**
 * Kiểm tra có phải number hợp lệ hay không.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isNumber(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

/**
 * Chuyển sang number.
 *
 * Alias của toSafeNumber.
 *
 * @param {number|string} value
 * @returns {number}
 */
export function toNumber(value) {
  return toSafeNumber(value);
}

/**
 * Tính tổng.
 *
 * Alias của sumNumbers.
 *
 * @param {number[]} values
 * @returns {number}
 */
export function sum(values) {
  return sumNumbers(values);
}

/**
 * Tính trung bình.
 *
 * @param {number[]} values
 * @returns {number}
 */
export function average(values) {
  if (!Array.isArray(values)) {
    throw new Error("Đầu vào phải là mảng.");
  }

  if (values.length === 0) {
    return 0;
  }

  return sumNumbers(values) / values.length;
}