/**
 * @file contract-utils.js
 * @description Các hàm tiện ích nghiệp vụ cho hợp đồng.
 */

import {
  CONTRACT_STATUS
} from "../constants/statuses.js";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Chuyển giá trị thành Date.
 *
 * @param {string|Date} value
 * @returns {Date}
 * @throws {Error}
 */
function toDate(value) {
  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Ngày không hợp lệ.");
  }

  return date;
}

/**
 * Chuẩn hóa Date về đầu ngày.
 *
 * @param {Date} date
 * @returns {Date}
 */
function normalizeDate(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

/**
 * Hai khoảng thời gian có giao nhau hay không.
 *
 * Khoảng được tính bao gồm cả ngày bắt đầu và kết thúc.
 *
 * @param {string|Date} startA
 * @param {string|Date} endA
 * @param {string|Date} startB
 * @param {string|Date} endB
 * @returns {boolean}
 */
export function isDateRangeOverlap(
  startA,
  endA,
  startB,
  endB
) {
  const aStart = normalizeDate(toDate(startA));
  const aEnd = normalizeDate(toDate(endA));

  const bStart = normalizeDate(toDate(startB));
  const bEnd = normalizeDate(toDate(endB));

  return (
    aStart <= bEnd &&
    bStart <= aEnd
  );
}

/**
 * Kiểm tra hợp đồng mới có bị trùng thời gian.
 *
 * @param {Object} newContract
 * @param {Array<Object>} existingContracts
 * @returns {boolean}
 */
export function hasOverlappingContract(
  newContract,
  existingContracts
) {
  if (!Array.isArray(existingContracts)) {
    throw new Error(
      "Danh sách hợp đồng không hợp lệ."
    );
  }

  return existingContracts.some(
    (contract) => {

      if (
        contract.id === newContract.id
      ) {
        return false;
      }

      if (
        contract.roomId !==
        newContract.roomId
      ) {
        return false;
      }

      if (
        contract.status ===
        CONTRACT_STATUS.TERMINATED
      ) {
        return false;
      }

      return isDateRangeOverlap(
        contract.startDate,
        contract.endDate,
        newContract.startDate,
        newContract.endDate
      );

    }
  );
}

/**
 * Xác định trạng thái hợp đồng.
 *
 * @param {Object} contract
 * @param {string|Date} currentDate
 * @returns {string}
 */
export function determineContractStatus(
  contract,
  currentDate = new Date()
) {
  if (
    contract.status ===
    CONTRACT_STATUS.TERMINATED
  ) {
    return CONTRACT_STATUS.TERMINATED;
  }

  const today =
    normalizeDate(
      toDate(currentDate)
    );

  const start =
    normalizeDate(
      toDate(contract.startDate)
    );

  const end =
    normalizeDate(
      toDate(contract.endDate)
    );

  if (today < start) {
    return CONTRACT_STATUS.PENDING;
  }

  if (today > end) {
    return CONTRACT_STATUS.EXPIRED;
  }

  return CONTRACT_STATUS.ACTIVE;
}

/**
 * Hợp đồng còn hiệu lực hay không.
 *
 * @param {Object} contract
 * @param {string|Date} currentDate
 * @returns {boolean}
 */
export function isContractActive(
  contract,
  currentDate = new Date()
) {
  return (
    determineContractStatus(
      contract,
      currentDate
    ) ===
    CONTRACT_STATUS.ACTIVE
  );
}

/**
 * Kiểm tra hợp đồng sắp hết hạn.
 *
 * @param {Object} contract
 * @param {string|Date} currentDate
 * @param {number} warningDays
 * @returns {boolean}
 */
export function isContractExpiringSoon(
  contract,
  currentDate = new Date(),
  warningDays = 30
) {
  if (
    !isContractActive(
      contract,
      currentDate
    )
  ) {
    return false;
  }

  if (
    warningDays < 0
  ) {
    throw new Error(
      "warningDays không hợp lệ."
    );
  }

  const today =
    normalizeDate(
      toDate(currentDate)
    );

  const end =
    normalizeDate(
      toDate(contract.endDate)
    );

  const days =
    Math.floor(
      (end - today) /
      MILLISECONDS_PER_DAY
    );

  return (
    days >= 0 &&
    days <= warningDays
  );
}