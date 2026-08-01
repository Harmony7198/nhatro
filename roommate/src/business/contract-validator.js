/**
 * @file contract-validator.js
 * @description Validation nghiệp vụ cho hợp đồng.
 */

import {
  ROOM_STATUS,
  CONTRACT_STATUS
} from "../constants/statuses.js";


import {
  isValidDate,
  compareDates
} from "../utils/date-utils.js";

import {
  isNonNegativeNumber
} from "../utils/number-utils.js";

/**
 * Validate hợp đồng.
 *
 * @param {Object} contract
 * @param {Object} options
 * @param {Array<Object>} options.existingContracts
 * @param {Object} options.room
 */
export function validateContract(
  contract,
  {
    existingContracts = [],
    room = null
  } = {}
) {

  if (!contract || typeof contract !== "object") {
    throw new Error("Dữ liệu hợp đồng không hợp lệ.");
  }

  if (!contract.roomId) {
    throw new Error("Phòng là bắt buộc.");
  }

  if (!contract.tenantId) {
    throw new Error("Người thuê là bắt buộc.");
  }

  if (!contract.startDate) {
    throw new Error("Ngày bắt đầu là bắt buộc.");
  }

  if (!contract.endDate) {
    throw new Error("Ngày kết thúc là bắt buộc.");
  }

  if (!isValidDate(contract.startDate)) {
    throw new Error("Ngày bắt đầu không hợp lệ.");
  }

  if (!isValidDate(contract.endDate)) {
    throw new Error("Ngày kết thúc không hợp lệ.");
  }

  if (
    compareDates(
      contract.startDate,
      contract.endDate
    ) >= 0
  ) {
    throw new Error(
      "Ngày kết thúc phải sau ngày bắt đầu."
    );
  }

  if (
    !isNonNegativeNumber(contract.rentPrice)
  ) {
    throw new Error(
      "Giá thuê phải lớn hơn hoặc bằng 0."
    );
  }

  if (
    !isNonNegativeNumber(contract.deposit)
  ) {
    throw new Error(
      "Tiền cọc phải lớn hơn hoặc bằng 0."
    );
  }

  if (room) {

    if (
      room.status === ROOM_STATUS.REPAIR
    ) {
      throw new Error(
        "Không thể ký hợp đồng cho phòng đang sửa chữa."
      );
    }

    if (
      room.status === ROOM_STATUS.INACTIVE
    ) {
      throw new Error(
        "Không thể ký hợp đồng cho phòng tạm ngưng."
      );
    }

  }

for (const item of existingContracts) {

  if (
    item.id === contract.id
  ) {
    continue;
  }

  if (
    item.roomId !== contract.roomId
  ) {
    continue;
  }

  if (
    item.status === CONTRACT_STATUS.CANCELLED
  ) {
    continue;
  }

  if (
    isDateRangeOverlap(
      item.startDate,
      item.endDate,
      contract.startDate,
      contract.endDate
    )
  ) {
    throw new Error(
      "Đã tồn tại hợp đồng trùng thời gian của phòng này."
    );
  }

}

}

/**
 * Kiểm tra sức chứa phòng.
 *
 * @param {Object} room
 * @param {Array<string>} tenantIds
 */
export function validateOccupancyLimit(
  room,
  tenantIds
) {

  if (!room) {
    throw new Error(
      "Không tìm thấy phòng."
    );
  }

  if (!Array.isArray(tenantIds)) {
    throw new Error(
      "Danh sách người thuê không hợp lệ."
    );
  }

  if (
    room.maxOccupancy == null
  ) {
    throw new Error(
      "Phòng chưa khai báo sức chứa."
    );
  }

  if (
    tenantIds.length >
    room.maxOccupancy
  ) {
    throw new Error(
      `Số người vượt quá sức chứa (${room.maxOccupancy}).`
    );
  }

}

/**
 * Kiểm tra hợp đồng có thể chuyển ACTIVE.
 *
 * @param {Object} room
 */
export function validateRoomAvailable(room) {

  if (!room) {
    throw new Error(
      "Không tìm thấy phòng."
    );
  }

  if (
    room.status === ROOM_STATUS.REPAIR
  ) {
    throw new Error(
      "Phòng đang sửa chữa."
    );
  }

  if (
    room.status === ROOM_STATUS.INACTIVE
  ) {
    throw new Error(
      "Phòng đang tạm ngưng."
    );
  }

}

/**
 * Kiểm tra danh sách hợp đồng.
 *
 * @param {Array<Object>} contracts
 */
export function validateContracts(
  contracts
) {

  if (!Array.isArray(contracts)) {
    throw new Error(
      "Danh sách hợp đồng không hợp lệ."
    );
  }

  contracts.forEach((contract) => {

    validateContract(contract);

  });

}

/**
 * Kiểm tra khoảng thời gian hợp lệ.
 *
 * Hàm này hữu ích cho Unit Test.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @returns {boolean}
 */
export function validateContractDateRange(
  startDate,
  endDate
) {

  if (!isValidDate(startDate)) {
    return false;
  }

  if (!isValidDate(endDate)) {
    return false;
  }

  return (
    compareDates(
      startDate,
      endDate
    ) < 0
  );

}

/**
 * Kiểm tra trạng thái hợp đồng có hợp lệ.
 *
 * @param {string} status
 * @returns {boolean}
 */
export function isValidContractStatus(
  status
) {

  return Object.values(
    CONTRACT_STATUS
  ).includes(status);

}