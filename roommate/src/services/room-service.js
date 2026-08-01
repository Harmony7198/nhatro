/**
 * @file room-service.js
 * @description Nghiệp vụ quản lý phòng.
 */

import {
  getAll,
  getById,
  create,
  update,
  remove
} from "./storage-service.js";

import { STORAGE_KEYS } from "../constants/storage-keys.js";

import { ROOM_STATUS, CONTRACT_STATUS } from "../constants/statuses.js";

import {
  validateRoom,
  validateUniqueRoomCode
} from "../business/room-validator.js";

/**
 * Lấy danh sách phòng.
 *
 * @returns {Array<Object>}
 */
export function getRooms() {
  return getAll(STORAGE_KEYS.ROOMS);
}

/**
 * Lấy thông tin phòng theo ID.
 *
 * @param {string} id
 * @returns {Object}
 *
 * @throws {Error}
 */
export function getRoomById(id) {
  const room = getById(STORAGE_KEYS.ROOMS, id);

  if (!room) {
    throw new Error("Không tìm thấy phòng.");
  }

  return room;
}

/**
 * Kiểm tra phòng có hợp đồng đang hiệu lực hay không.
 *
 * @param {string} roomId
 * @returns {boolean}
 */
function hasActiveContract(roomId) {
  const contracts = getAll(STORAGE_KEYS.CONTRACTS);

  return contracts.some(
    (contract) =>
      contract.roomId === roomId &&
      contract.status === CONTRACT_STATUS.ACTIVE
  );
}

/**
 * Tạo mới phòng.
 *
 * @param {Object} data
 * @returns {Object}
 *
 * @throws {Error}
 */
export function createRoom(data) {
  const room = validateRoom(data);

  const rooms = getRooms();

  validateUniqueRoomCode(room.code, rooms);

  if (room.status === ROOM_STATUS.OCCUPIED) {
    throw new Error(
      "Không thể tạo phòng với trạng thái 'Đang thuê'."
    );
  }

  return create(STORAGE_KEYS.ROOMS, room);
}

/**
 * Kiểm tra có được chuyển trạng thái phòng hay không.
 *
 * @param {Object} currentRoom
 * @param {Object} newRoom
 *
 * @throws {Error}
 */
function validateStatusTransition(currentRoom, newRoom) {
  if (
    currentRoom.status === newRoom.status
  ) {
    return;
  }

  if (
    newRoom.status === ROOM_STATUS.AVAILABLE &&
    hasActiveContract(currentRoom.id)
  ) {
    throw new Error(
      "Không thể chuyển phòng thành trống khi còn hợp đồng đang hiệu lực."
    );
  }

  if (
    newRoom.status === ROOM_STATUS.OCCUPIED &&
    currentRoom.status === ROOM_STATUS.MAINTENANCE
  ) {
    throw new Error(
      "Không thể cho thuê phòng đang sửa chữa."
    );
  }
}

/**
 * Cập nhật thông tin phòng.
 *
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 *
 * @throws {Error}
 */
export function updateRoom(id, data) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("ID phòng không hợp lệ.");
  }

  const currentRoom = getRoomById(id);

  const mergedRoom = {
    ...currentRoom,
    ...data
  };

  const validatedRoom = validateRoom(mergedRoom);

  const rooms = getRooms();

  validateUniqueRoomCode(
    validatedRoom.code,
    rooms,
    id
  );

  validateStatusTransition(
    currentRoom,
    validatedRoom
  );

  return update(
    STORAGE_KEYS.ROOMS,
    id,
    validatedRoom
  );
}

/**
 * Xóa phòng.
 *
 * @param {string} id
 * @returns {boolean}
 *
 * @throws {Error}
 */
export function deleteRoom(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("ID phòng không hợp lệ.");
  }

  getRoomById(id);

  if (hasActiveContract(id)) {
    throw new Error(
      "Không thể xóa phòng đang có hợp đồng hiệu lực."
    );
  }

  return remove(
    STORAGE_KEYS.ROOMS,
    id
  );
}

/**
 * Tìm kiếm phòng.
 *
 * Tìm theo:
 * - mã phòng
 * - tên phòng
 *
 * @param {string} keyword
 * @returns {Array<Object>}
 */
export function searchRooms(keyword) {
  const rooms = getRooms();

  if (typeof keyword !== "string") {
    return rooms;
  }

  const text = keyword
    .trim()
    .toLowerCase();

  if (!text) {
    return rooms;
  }

  return rooms.filter((room) => {
    return (
      room.code.toLowerCase().includes(text) ||
      room.name.toLowerCase().includes(text)
    );
  });
}

/**
 * Lọc danh sách phòng.
 *
 * filters:
 * {
 *   status,
 *   floor,
 *   minPrice,
 *   maxPrice
 * }
 *
 * @param {Object} filters
 * @returns {Array<Object>}
 */
export function filterRooms(filters = {}) {
  let rooms = getRooms();

  if (filters.status) {
    rooms = rooms.filter(
      (room) =>
        room.status === filters.status
    );
  }

  if (filters.floor !== undefined) {
    rooms = rooms.filter(
      (room) =>
        room.floor === filters.floor
    );
  }

  if (filters.minPrice !== undefined) {
    rooms = rooms.filter(
      (room) =>
        room.rentPrice >= filters.minPrice
    );
  }

  if (filters.maxPrice !== undefined) {
    rooms = rooms.filter(
      (room) =>
        room.rentPrice <= filters.maxPrice
    );
  }

  return rooms;
}

/**
 * Lấy danh sách phòng còn trống.
 *
 * @returns {Array<Object>}
 */
export function getAvailableRooms() {
  return getRooms().filter(
    (room) =>
      room.status === ROOM_STATUS.AVAILABLE
  );
}

/**
 * Lấy số người đang ở trong phòng.
 *
 * @param {string} roomId
 * @returns {{
 *   currentOccupants:number,
 *   maxOccupants:number,
 *   availableSlots:number,
 *   isFull:boolean
 * }}
 *
 * @throws {Error}
 */
export function getRoomOccupancy(roomId) {
  const room = getRoomById(roomId);

  const tenants = getAll(
    STORAGE_KEYS.TENANTS
  );

  const currentOccupants = tenants.filter(
    (tenant) =>
      tenant.roomId === roomId
  ).length;

  const availableSlots =
    room.maxOccupants -
    currentOccupants;

  return {
    currentOccupants,
    maxOccupants: room.maxOccupants,
    availableSlots: Math.max(
      0,
      availableSlots
    ),
    isFull:
      currentOccupants >=
      room.maxOccupants
  };
}