/**
 * @file validation-utils.js
 * @description Các hàm tiện ích kiểm tra dữ liệu đầu vào cho RoomMate.
 */

/**
 * Kiểm tra giá trị có phải chuỗi hay không.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
function isString(value) {
  return typeof value === "string";
}

/**
 * Kiểm tra chuỗi rỗng (sau khi trim).
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (!isString(value)) {
    return true;
  }

  return value.trim().length === 0;
}

/**
 * Alias của isEmpty.
 *
 * Giữ tương thích với các module cũ.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isBlank(value) {
  return isEmpty(value);
}

/**
 * Kiểm tra chuỗi không rỗng.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNotEmpty(value) {
  return !isEmpty(value);
}

/**
 * Kiểm tra độ dài tối thiểu.
 *
 * @param {unknown} value
 * @param {number} minLength
 * @returns {boolean}
 *
 * @throws {Error}
 */
export function hasMinLength(value, minLength) {
  if (!Number.isInteger(minLength) || minLength < 0) {
    throw new Error("minLength phải là số nguyên không âm.");
  }

  if (!isString(value)) {
    return false;
  }

  return value.trim().length >= minLength;
}

/**
 * Kiểm tra độ dài tối đa.
 *
 * @param {unknown} value
 * @param {number} maxLength
 * @returns {boolean}
 *
 * @throws {Error}
 */
export function hasMaxLength(value, maxLength) {
  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new Error("maxLength phải là số nguyên không âm.");
  }

  if (!isString(value)) {
    return false;
  }

  return value.trim().length <= maxLength;
}

/**
 * Kiểm tra chuỗi nằm trong khoảng độ dài.
 *
 * @param {unknown} value
 * @param {number} minLength
 * @param {number} maxLength
 * @returns {boolean}
 *
 * @throws {Error}
 */
export function hasLengthBetween(value, minLength, maxLength) {
  if (minLength > maxLength) {
    throw new Error("minLength không được lớn hơn maxLength.");
  }

  return (
    hasMinLength(value, minLength) &&
    hasMaxLength(value, maxLength)
  );
}

/**
 * Kiểm tra số điện thoại Việt Nam.
 *
 * Hỗ trợ:
 * 03xxxxxxxx
 * 05xxxxxxxx
 * 07xxxxxxxx
 * 08xxxxxxxx
 * 09xxxxxxxx
 * 84xxxxxxxxx
 * +84xxxxxxxxx
 *
 * @param {unknown} phone
 * @returns {boolean}
 */
export function isVietnamesePhoneNumber(phone) {
  if (!isString(phone)) {
    return false;
  }

  const normalized = phone
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "");

  const pattern =
    /^(0(3|5|7|8|9)\d{8}|(\+84|84)(3|5|7|8|9)\d{8})$/;

  return pattern.test(normalized);
}

/**
 * Kiểm tra email cơ bản.
 *
 * @param {unknown} email
 * @returns {boolean}
 */
export function isEmail(email) {
  if (!isString(email)) {
    return false;
  }

  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(email.trim());
}

/**
 * Kiểm tra số không âm.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonNegative(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

/**
 * Kiểm tra số dương.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPositive(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
}

/**
 * Kiểm tra ngày hợp lệ.
 *
 * Hỗ trợ:
 * - Date
 * - ISO String
 * - yyyy-mm-dd
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isValidDate(value) {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (!isString(value)) {
    return false;
  }

  const text = value.trim();

  if (!text) {
    return false;
  }

  const date = new Date(text);

  return !Number.isNaN(date.getTime());
}

/**
 * Kiểm tra giá trị có thuộc danh sách cho phép.
 *
 * @template T
 * @param {T} value
 * @param {readonly T[]|T[]} allowedValues
 * @returns {boolean}
 *
 * @throws {Error}
 */
export function isInEnum(value, allowedValues) {
  if (!Array.isArray(allowedValues)) {
    throw new Error("allowedValues phải là một mảng.");
  }

  return allowedValues.includes(value);
}

/**
 * Kiểm tra một object có null hoặc undefined hay không.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isRequired(value) {
  return value !== null && value !== undefined;
}