/**
 * @file date-utils.js
 * @description Các hàm tiện ích xử lý ngày tháng cho RoomMate.
 */

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Kiểm tra giá trị có phải Date hợp lệ hay không.
 *
 * @param {Date} date
 * @returns {boolean}
 */
function isValidDateObject(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * Chuyển đầu vào thành Date.
 *
 * Hỗ trợ:
 * - Date
 * - ISO string
 * - yyyy-mm-dd
 *
 * @param {Date|string} value
 * @returns {Date}
 *
 * @throws {Error}
 */
function toDate(value) {
  if (value instanceof Date) {
    if (!isValidDateObject(value)) {
      throw new Error("Đối tượng Date không hợp lệ.");
    }

    return new Date(value.getTime());
  }

  if (typeof value !== "string") {
    throw new Error("Ngày phải là chuỗi hoặc Date.");
  }

  const text = value.trim();

  if (!text) {
    throw new Error("Ngày không được để trống.");
  }

  const date = new Date(text);

  if (!isValidDateObject(date)) {
    throw new Error("Ngày không hợp lệ.");
  }

  return date;
}

/**
 * Lấy ngày giờ hiện tại theo ISO.
 *
 * @returns {string}
 */
export function getCurrentIsoDateTime() {
  return new Date().toISOString();
}

/**
 * Định dạng Date thành dd/mm/yyyy.
 *
 * @param {Date|string} value
 * @returns {string}
 *
 * @throws {Error}
 */
export function formatDate(value) {
  const date = toDate(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Chuyển yyyy-mm-dd sang dd/mm/yyyy.
 *
 * @param {string} value
 * @returns {string}
 *
 * @throws {Error}
 */
export function formatInputDate(value) {
  if (typeof value !== "string") {
    throw new Error("Ngày phải là chuỗi.");
  }

  const text = value.trim();

  const pattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!pattern.test(text)) {
    throw new Error("Định dạng phải là yyyy-mm-dd.");
  }

  return formatDate(text);
}

/**
 * So sánh hai ngày.
 *
 * Trả về:
 * -1 : date1 < date2
 *  0 : bằng nhau
 *  1 : date1 > date2
 *
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number}
 *
 * @throws {Error}
 */
export function compareDates(date1, date2) {
  const first = toDate(date1);
  const second = toDate(date2);

  const firstTime = first.getTime();
  const secondTime = second.getTime();

  if (firstTime < secondTime) {
    return -1;
  }

  if (firstTime > secondTime) {
    return 1;
  }

  return 0;
}

/**
 * Tính số ngày giữa hai ngày.
 *
 * Luôn trả về số không âm.
 *
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number}
 *
 * @throws {Error}
 */
export function daysBetween(startDate, endDate) {
  const start = toDate(startDate);
  const end = toDate(endDate);

  const startOnly = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const endOnly = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  const difference = Math.abs(endOnly.getTime() - startOnly.getTime());

  return Math.floor(difference / MILLISECONDS_PER_DAY);
}

/**
 * Kiểm tra ngày có hợp lệ hay không.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isValidDate(value) {
  try {
    toDate(value);
    return true;
  } catch {
    return false;
  }
}