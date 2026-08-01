/**
 * @file id-utils.js
 * @description Các hàm tiện ích tạo ID cho RoomMate.
 */

/**
 * Tiền tố mặc định.
 */
const DEFAULT_PREFIX = "ID";

/**
 * Sinh chuỗi ngẫu nhiên.
 *
 * @param {number} length Độ dài chuỗi.
 * @returns {string}
 */
function randomString(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
}

/**
 * Sinh ID duy nhất.
 *
 * Ví dụ:
 * ROOM-20260726123045-AB12CD34
 *
 * @param {string} [prefix="ID"] Tiền tố.
 * @returns {string}
 *
 * @throws {Error}
 */
export function generateId(prefix = DEFAULT_PREFIX) {
  if (typeof prefix !== "string") {
    throw new Error("Prefix phải là chuỗi.");
  }

  const normalizedPrefix = prefix.trim().toUpperCase();

  if (!normalizedPrefix) {
    throw new Error("Prefix không được để trống.");
  }

  const now = new Date();

  const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0") +
    String(now.getMilliseconds()).padStart(3, "0");

  return `${normalizedPrefix}-${timestamp}-${randomString(8)}`;
}

/**
 * Kiểm tra ID có đúng định dạng generateId() hay không.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function isValidGeneratedId(id) {
  if (typeof id !== "string") {
    return false;
  }

  const pattern =
    /^[A-Z0-9]+-\d{17}-[A-Z0-9]{8}$/;

  return pattern.test(id);
}