/**
 * @file meter-reading-service.js
 * @description Service quản lý chỉ số điện nước.
 */

import { STORAGE_KEYS } from "../constants/storage-keys.js";

import * as StorageService from "./storage-service.js";
import * as RoomService from "./room-service.js";
import * as ContractService from "./contract-service.js";

import {
  calculateElectricUsage,
  calculateWaterUsage,
  getPreviousMonthKey
} from "../business/meter-calculator.js";

import {
  validateMeterReading,
  validatePreviousIndex
} from "../business/meter-validator.js";

/**
 * Lấy toàn bộ bản ghi.
 *
 * @returns {Array}
 */
export function getReadings() {
  return StorageService.getAll(
    STORAGE_KEYS.METER_READINGS
  );
}

/**
 * Lấy bản ghi theo ID.
 *
 * @param {string} id
 * @returns {Object}
 */
export function getReadingById(id) {

  if (!id) {
    throw new Error(
      "ID bản ghi là bắt buộc."
    );
  }

  const reading =
    StorageService.getById(
      STORAGE_KEYS.METER_READINGS,
      id
    );

  if (!reading) {
    throw new Error(
      "Không tìm thấy bản ghi chỉ số."
    );
  }

  return reading;

}

/**
 * Lấy bản ghi theo phòng và tháng.
 *
 * @param {string} roomId
 * @param {string} month
 * @returns {Object|null}
 */
export function getReadingByRoomAndMonth(
  roomId,
  month
) {

  return getReadings().find(
    (reading) =>
      reading.roomId === roomId &&
      reading.monthKey === month
  ) ?? null;

}

/**
 * Lấy bản ghi tháng trước.
 *
 * @param {string} roomId
 * @param {string} month
 * @returns {Object|null}
 */
export function getPreviousReading(
  roomId,
  month
) {

  const previousMonth =
    getPreviousMonthKey(
      month
    );

  return getReadingByRoomAndMonth(
    roomId,
    previousMonth
  );

}

/**
 * Kiểm tra phòng có hợp đồng
 * hiệu lực trong tháng.
 *
 * @param {string} roomId
 * @returns {boolean}
 */
function hasActiveContract(
  roomId
) {

  return Boolean(
    ContractService.getActiveContractByRoom(
      roomId
    )
  );

}

/**
 * Kiểm tra hóa đơn đã tồn tại.
 *
 * @param {string} readingId
 * @returns {boolean}
 */
function hasInvoice(
  readingId
) {

  const invoices =
    StorageService.getAll(
      STORAGE_KEYS.INVOICES
    );

  return invoices.some(
    (invoice) =>
      invoice.meterReadingId ===
      readingId
  );

}

/**
 * Tự tính lượng sử dụng.
 *
 * @param {Object} reading
 * @returns {Object}
 */
function calculateUsage(
  reading
) {

  return {

    ...reading,

    electricUsage:
      calculateElectricUsage(
        reading.electricOldIndex,
        reading.electricNewIndex
      ),

    waterUsage:
      calculateWaterUsage(
        reading.waterOldIndex,
        reading.waterNewIndex
      )

  };

}

/**
 * Gán chỉ số cũ từ tháng trước.
 *
 * @param {Object} reading
 * @returns {Object}
 */
function applyPreviousIndexes(
  reading
) {

  const previous =
    getPreviousReading(
      reading.roomId,
      reading.monthKey
    );

  if (!previous) {
    return reading;
  }

  return {

    ...reading,

    electricOldIndex:
      reading.electricOldIndex ??
      previous.electricNewIndex,

    waterOldIndex:
      reading.waterOldIndex ??
      previous.waterNewIndex

  };

}

/**
 * Tạo bản ghi chỉ số.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function createReading(data) {

  let reading =
    applyPreviousIndexes({
      ...data
    });

  validateMeterReading(reading);

  if (!hasActiveContract(reading.roomId)) {
    throw new Error(
      "Chỉ có thể ghi chỉ số cho phòng đang có hợp đồng hiệu lực."
    );
  }

  const duplicated =
    getReadingByRoomAndMonth(
      reading.roomId,
      reading.monthKey
    );

  if (duplicated) {
    throw new Error(
      "Phòng đã có bản ghi chỉ số trong tháng này."
    );
  }

  const previous =
    getPreviousReading(
      reading.roomId,
      reading.monthKey
    );

  let warning = null;

  if (previous) {

    try {

      validatePreviousIndex(
        reading,
        previous
      );

    } catch (error) {

      warning = error.message;

    }

  }

  reading =
    calculateUsage(reading);

  const created =
    StorageService.create(
      STORAGE_KEYS.METER_READINGS,
      reading
    );

  return {
    reading: created,
    warning
  };

}

/**
 * Cập nhật bản ghi chỉ số.
 *
 * @param {string} id
 * @param {Object} changes
 * @returns {Object}
 */
export function updateReading(
  id,
  changes
) {

  const current =
    getReadingById(id);

  let reading =
    applyPreviousIndexes({
      ...current,
      ...changes,
      id
    });

  validateMeterReading(reading);

  if (!hasActiveContract(reading.roomId)) {
    throw new Error(
      "Phòng không có hợp đồng hiệu lực."
    );
  }

  const duplicated =
    getReadings().find(
      (item) =>
        item.id !== id &&
        item.roomId === reading.roomId &&
        item.monthKey === reading.monthKey
    );

  if (duplicated) {
    throw new Error(
      "Phòng đã có bản ghi chỉ số trong tháng này."
    );
  }

  const previous =
    getPreviousReading(
      reading.roomId,
      reading.monthKey
    );

  let warning = null;

  if (previous) {

    try {

      validatePreviousIndex(
        reading,
        previous
      );

    } catch (error) {

      warning = error.message;

    }

  }

  if (hasInvoice(id)) {

    warning = warning
      ? `${warning}\nHóa đơn liên quan đã tồn tại. Cần kiểm tra và cập nhật hóa đơn nếu cần.`
      : "Hóa đơn liên quan đã tồn tại. Cần kiểm tra và cập nhật hóa đơn nếu cần.";

  }

  reading =
    calculateUsage(reading);

  const updated =
    StorageService.update(
      STORAGE_KEYS.METER_READINGS,
      id,
      reading
    );

  return {
    reading: updated,
    warning
  };

}