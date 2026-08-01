/**
 * @file seed-service.js
 * @description Khởi tạo dữ liệu mẫu cho RoomMate.
 */

import { STORAGE_KEYS } from "../constants/storage-keys.js";
import { SEED_DATA } from "../data/seed-data.js";
import {
  getAll,
  replaceAll
} from "./storage-service.js";

/**
 * Danh sách collection cần seed.
 */
const COLLECTIONS = Object.freeze([
  {
    key: STORAGE_KEYS.ROOMS,
    data: SEED_DATA.rooms
  },
  {
    key: STORAGE_KEYS.TENANTS,
    data: SEED_DATA.tenants
  },
  {
    key: STORAGE_KEYS.CONTRACTS,
    data: SEED_DATA.contracts
  },
  {
    key: STORAGE_KEYS.METER_READINGS,
    data: SEED_DATA.meterReadings
  },
  {
    key: STORAGE_KEYS.SERVICE_CONFIGS,
    data: SEED_DATA.serviceConfigs
  },
  {
    key: STORAGE_KEYS.INVOICES,
    data: SEED_DATA.invoices
  },
  {
    key: STORAGE_KEYS.PAYMENTS,
    data: SEED_DATA.payments
  }
]);

/**
 * Seed dữ liệu nếu collection đang rỗng.
 *
 * Không ghi đè dữ liệu đã có.
 *
 * @returns {boolean}
 * true  : có seed ít nhất một collection
 * false : không seed gì
 */
export function seedIfEmpty() {
  let seeded = false;

  COLLECTIONS.forEach(({ key, data }) => {
    const current = getAll(key);

    if (current.length === 0) {
      replaceAll(key, data);
      seeded = true;
    }
  });

  return seeded;
}

/**
 * Khôi phục toàn bộ dữ liệu mẫu.
 *
 * Hàm này sẽ ghi đè dữ liệu hiện có.
 *
 * @returns {boolean}
 */
export function resetToSeedData() {
  COLLECTIONS.forEach(({ key, data }) => {
    replaceAll(key, data);
  });

  return true;
}
