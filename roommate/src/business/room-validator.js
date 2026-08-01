/**
 * @file room-validator.js
 * @description Validation nghiệp vụ cho quản lý phòng.
 */

import { ROOM_STATUS } from "../constants/statuses.js";

/**
 * Chuẩn hóa mã phòng.
 *
 * - Trim khoảng trắng
 * - Viết hoa
 *
 * @param {string} code
 * @returns {string}
 */
export function normalizeRoomCode(code) {
  if (typeof code !== "string") {
    throw new Error("Mã phòng phải là chuỗi.");
  }

  return code.trim().toUpperCase();
}

/**
 * Kiểm tra mã phòng.
 *
 * @param {string} code
 * @throws {Error}
 */
export function validateRoomCode(code) {
  const normalized = normalizeRoomCode(code);

  if (!normalized) {
    throw new Error("Mã phòng không được để trống.");
  }

  if (normalized.length > 30) {
    throw new Error("Mã phòng không được vượt quá 30 ký tự.");
  }

  return normalized;
}

/**
 * Kiểm tra tên phòng.
 *
 * @param {string} name
 * @returns {string}
 * @throws {Error}
 */
export function validateRoomName(name) {
  if (typeof name !== "string") {
    throw new Error("Tên phòng phải là chuỗi.");
  }

  const value = name.trim();

  if (!value) {
    throw new Error("Tên phòng không được để trống.");
  }

  if (value.length > 100) {
    throw new Error("Tên phòng không được vượt quá 100 ký tự.");
  }

  return value;
}

/**
 * Kiểm tra giá thuê.
 *
 * @param {number} rentPrice
 * @returns {number}
 * @throws {Error}
 */
export function validateRentPrice(rentPrice) {
  if (typeof rentPrice !== "number" || Number.isNaN(rentPrice)) {
    throw new Error("Giá thuê phải là số.");
  }

  if (rentPrice < 0) {
    throw new Error("Giá thuê không được âm.");
  }

  return rentPrice;
}

/**
 * Kiểm tra diện tích.
 *
 * @param {number} area
 * @returns {number}
 * @throws {Error}
 */
export function validateArea(area) {
  if (typeof area !== "number" || Number.isNaN(area)) {
    throw new Error("Diện tích phải là số.");
  }

  if (area <= 0) {
    throw new Error("Diện tích phải lớn hơn 0.");
  }

  return area;
}

/**
 * Kiểm tra số người tối đa.
 *
 * @param {number} maxOccupants
 * @returns {number}
 * @throws {Error}
 */
export function validateMaxOccupants(maxOccupants) {
  if (
    typeof maxOccupants !== "number" ||
    Number.isNaN(maxOccupants)
  ) {
    throw new Error("Số người tối đa phải là số.");
  }

  if (!Number.isInteger(maxOccupants)) {
    throw new Error("Số người tối đa phải là số nguyên.");
  }

  if (maxOccupants <= 0) {
    throw new Error("Số người tối đa phải lớn hơn 0.");
  }

  return maxOccupants;
}

/**
 * Kiểm tra trạng thái phòng.
 *
 * @param {string} status
 * @returns {string}
 * @throws {Error}
 */
export function validateRoomStatus(status) {
  const statuses = Object.values(ROOM_STATUS);

  if (!statuses.includes(status)) {
    throw new Error("Trạng thái phòng không hợp lệ.");
  }

  return status;
}

/**
 * Kiểm tra toàn bộ dữ liệu phòng.
 *
 * @param {Object} room
 * @returns {Object}
 * @throws {Error}
 */
export function validateRoom(room) {
  if (
    room === null ||
    typeof room !== "object" ||
    Array.isArray(room)
  ) {
    throw new Error("Thông tin phòng không hợp lệ.");
  }

  return {
    ...room,
    code: validateRoomCode(room.code),
    name: validateRoomName(room.name),
    rentPrice: validateRentPrice(room.rentPrice),
    area: validateArea(room.area),
    maxOccupants: validateMaxOccupants(room.maxOccupants),
    status: validateRoomStatus(room.status),
    note: typeof room.note === "string"
      ? room.note.trim()
      : ""
  };
}

/**
 * Kiểm tra mã phòng có bị trùng không.
 *
 * @param {string} code
 * @param {Array<Object>} rooms
 * @param {string|null} ignoreId
 * @throws {Error}
 */
export function validateUniqueRoomCode(
  code,
  rooms,
  ignoreId = null
) {
  const normalized = normalizeRoomCode(code);

  const duplicated = rooms.some((room) => {
    if (ignoreId && room.id === ignoreId) {
      return false;
    }

    return normalizeRoomCode(room.code) === normalized;
  });

  if (duplicated) {
    throw new Error("Mã phòng đã tồn tại.");
  }
}
