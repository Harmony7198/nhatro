/**
 * @file tenant-service.js
 * @description Service quản lý người thuê.
 */

import { STORAGE_KEYS } from "../constants/storage-keys.js";
import { CONTRACT_STATUS } from "../constants/statuses.js";

import * as StorageService from "./storage-service.js";

import {
  normalizeTenant,
  normalizePhone,
  normalizeIdentityNumber,
  validateTenant,
  validateDeleteTenant,
  validateArchiveTenant
} from "../business/tenant-validator.js";

/**
 * Lấy toàn bộ người thuê đang hoạt động.
 *
 * @returns {Array}
 */
export function getTenants() {
  return StorageService
    .getAll(STORAGE_KEYS.TENANTS)
    .filter((tenant) => !tenant.archived);
}

/**
 * Lấy người thuê theo id.
 *
 * @param {string} id
 * @returns {Object}
 */
export function getTenantById(id) {
  if (!id) {
    throw new Error("ID người thuê là bắt buộc.");
  }

  const tenant = StorageService.getById(
    STORAGE_KEYS.TENANTS,
    id
  );

  if (!tenant) {
    throw new Error("Không tìm thấy người thuê.");
  }

  return tenant;
}

/**
 * Tìm kiếm người thuê.
 *
 * @param {string} keyword
 * @returns {Array}
 */
export function searchTenants(keyword = "") {
  const text = keyword.trim().toLowerCase();

  return getTenants().filter((tenant) => {
    return (
      tenant.fullName.toLowerCase().includes(text) ||
      tenant.phoneNumber.toLowerCase().includes(text) ||
      (tenant.identityNumber ?? "")
        .toLowerCase()
        .includes(text)
    );
  });
}

/**
 * Tạo người thuê mới.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function createTenant(data) {
  const tenant = normalizeTenant(data);

  validateTenant(tenant, {
    duplicatedPhone: phoneExists(
      tenant.phoneNumber
    ),
    duplicatedIdentity: identityExists(
      tenant.identityNumber
    )
  });

  return StorageService.create(
    STORAGE_KEYS.TENANTS,
    tenant
  );
}

/**
 * Kiểm tra số điện thoại đã tồn tại.
 *
 * @param {string} phone
 * @param {string} ignoreId
 * @returns {boolean}
 */
function phoneExists(
  phone,
  ignoreId = null
) {
  if (!phone) {
    return false;
  }

  const normalized =
    normalizePhone(phone);

  return StorageService.exists(
    STORAGE_KEYS.TENANTS,
    (tenant) =>
      tenant.id !== ignoreId &&
      !tenant.archived &&
      normalizePhone(
        tenant.phoneNumber
      ) === normalized
  );
}

/**
 * Kiểm tra CCCD đã tồn tại.
 *
 * @param {string} identity
 * @param {string} ignoreId
 * @returns {boolean}
 */
function identityExists(
  identity,
  ignoreId = null
) {
  if (!identity) {
    return false;
  }

  const normalized =
    normalizeIdentityNumber(
      identity
    );

  return StorageService.exists(
    STORAGE_KEYS.TENANTS,
    (tenant) =>
      tenant.id !== ignoreId &&
      !tenant.archived &&
      normalizeIdentityNumber(
        tenant.identityNumber
      ) === normalized
  );
}

/**
 * Kiểm tra có hợp đồng hiệu lực.
 *
 * @param {string} tenantId
 * @returns {boolean}
 */
function hasActiveContract(
  tenantId
) {
  const contracts =
    StorageService.getAll(
      STORAGE_KEYS.CONTRACTS
    );

  return contracts.some(
    (contract) =>
      contract.tenantId === tenantId &&
      contract.status ===
        CONTRACT_STATUS.ACTIVE
  );
}

/**
 * Cập nhật người thuê.
 *
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 */
export function updateTenant(id, data) {
  const current = getTenantById(id);

  const tenant = normalizeTenant({
    ...current,
    ...data
  });

  validateTenant(tenant, {
    duplicatedPhone: phoneExists(
      tenant.phoneNumber,
      id
    ),
    duplicatedIdentity: identityExists(
      tenant.identityNumber,
      id
    )
  });

  return StorageService.update(
    STORAGE_KEYS.TENANTS,
    id,
    tenant
  );
}

/**
 * Lưu trữ người thuê.
 *
 * @param {string} id
 * @returns {Object}
 */
export function archiveTenant(id) {
  const tenant = getTenantById(id);

  validateArchiveTenant(tenant);

  return StorageService.update(
    STORAGE_KEYS.TENANTS,
    id,
    {
      archived: true
    }
  );
}

/**
 * Xóa người thuê.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function deleteTenant(id) {
  const tenant = getTenantById(id);

  validateDeleteTenant(
    hasActiveContract(id)
  );

  return StorageService.remove(
    STORAGE_KEYS.TENANTS,
    tenant.id
  );
}

/**
 * Lấy lịch sử thuê.
 *
 * @param {string} tenantId
 * @returns {Array}
 */
export function getTenantRentalHistory(
  tenantId
) {
  getTenantById(tenantId);

  const contracts =
    StorageService.getAll(
      STORAGE_KEYS.CONTRACTS
    );

  const rooms =
    StorageService.getAll(
      STORAGE_KEYS.ROOMS
    );

  return contracts
    .filter(
      (contract) =>
        contract.tenantId === tenantId
    )
    .map((contract) => {

      const room = rooms.find(
        (room) =>
          room.id === contract.roomId
      );

      return {
        ...contract,
        roomCode:
          room?.code ?? "",
        roomName:
          room?.name ?? ""
      };

    })
    .sort((a, b) =>
      new Date(b.startDate) -
      new Date(a.startDate)
    );
}

/**
 * Lấy phòng hiện tại.
 *
 * @param {string} tenantId
 * @returns {Object|null}
 */
export function getCurrentRoomOfTenant(
  tenantId
) {
  getTenantById(tenantId);

  const contracts =
    StorageService.getAll(
      STORAGE_KEYS.CONTRACTS
    );

  const activeContract =
    contracts.find(
      (contract) =>
        contract.tenantId === tenantId &&
        contract.status ===
          CONTRACT_STATUS.ACTIVE
    );

  if (!activeContract) {
    return null;
  }

  return StorageService.getById(
    STORAGE_KEYS.ROOMS,
    activeContract.roomId
  );
}

/**
 * Lấy tất cả người thuê,
 * bao gồm cả đã lưu trữ.
 *
 * @returns {Array}
 */
export function getAllTenants() {
  return StorageService.getAll(
    STORAGE_KEYS.TENANTS
  );
}

/**
 * Kiểm tra người thuê tồn tại.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function tenantExists(id) {
  return StorageService.exists(
    STORAGE_KEYS.TENANTS,
    (tenant) => tenant.id === id
  );
}
