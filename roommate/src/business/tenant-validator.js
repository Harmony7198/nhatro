/**
 * @file tenant-validator.js
 * @description Validation nghiệp vụ cho Người thuê.
 */

import {
  TENANT_STATUS
} from "../constants/statuses.js";

import {
  isBlank,
  isVietnamesePhoneNumber
} from "../utils/validation-utils.js";

/**
 * Chuẩn hóa họ tên.
 *
 * @param {string} name
 * @returns {string}
 */
export function normalizeTenantName(name) {
  if (typeof name !== "string") {
    throw new Error("Họ tên phải là chuỗi.");
  }

  return name
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Chuẩn hóa số điện thoại.
 *
 * Ví dụ:
 * 0912 345 678
 * -> 0912345678
 *
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhone(phone) {
  if (phone == null) {
    return "";
  }

  return String(phone)
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .trim();
}

/**
 * Chuẩn hóa CCCD.
 *
 * Chỉ giữ số.
 *
 * @param {string} identityNumber
 * @returns {string}
 */
export function normalizeIdentityNumber(identityNumber) {
  if (identityNumber == null) {
    return "";
  }

  return String(identityNumber)
    .replace(/\D/g, "")
    .trim();
}

/**
 * Validate dữ liệu người thuê.
 *
 * @param {Object} tenant
 * @param {Object} options
 */
export function validateTenant(
  tenant,
  {
    duplicatedPhone = false,
    duplicatedIdentity = false
  } = {}
) {
  if (!tenant || typeof tenant !== "object") {
    throw new Error("Dữ liệu người thuê không hợp lệ.");
  }

  const name = normalizeTenantName(
    tenant.fullName ?? ""
  );

  if (isBlank(name)) {
    throw new Error("Họ tên là bắt buộc.");
  }

  const phone = normalizePhone(
    tenant.phoneNumber ?? ""
  );

  if (!isBlank(phone)) {
    if (!isVietnamesePhoneNumber(phone)) {
      throw new Error(
        "Số điện thoại không đúng định dạng."
      );
    }

    if (duplicatedPhone) {
      throw new Error(
        "Số điện thoại đã tồn tại."
      );
    }
  }

  const identityNumber =
    normalizeIdentityNumber(
      tenant.identityNumber ?? ""
    );

  if (!isBlank(identityNumber)) {
    if (!/^\d{9}$|^\d{12}$/.test(identityNumber)) {
      throw new Error(
        "CCCD phải gồm 9 hoặc 12 chữ số."
      );
    }

    if (duplicatedIdentity) {
      throw new Error("CCCD đã tồn tại.");
    }
  }

  if (
    tenant.status &&
    !Object.values(TENANT_STATUS).includes(
      tenant.status
    )
  ) {
    throw new Error(
      "Trạng thái người thuê không hợp lệ."
    );
  }

  if (
    tenant.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      tenant.email
    )
  ) {
    throw new Error("Email không hợp lệ.");
  }
}

/**
 * Chuẩn hóa dữ liệu trước khi lưu.
 *
 * @param {Object} tenant
 * @returns {Object}
 */
export function normalizeTenant(tenant) {
  return {
    ...tenant,

    fullName: normalizeTenantName(
      tenant.fullName ?? ""
    ),

    phoneNumber: normalizePhone(
      tenant.phoneNumber ?? ""
    ),

    identityNumber:
      normalizeIdentityNumber(
        tenant.identityNumber ?? ""
      ),

    email: tenant.email
      ? tenant.email.trim().toLowerCase()
      : "",

    status:
      tenant.status ??
      TENANT_STATUS.ACTIVE,

    archived:
      tenant.archived ?? false
  };
}

/**
 * Kiểm tra có thể xóa.
 *
 * @param {boolean} hasActiveContract
 */
export function validateDeleteTenant(
  hasActiveContract
) {
  if (hasActiveContract) {
    throw new Error(
      "Không thể xóa người thuê có hợp đồng hiệu lực."
    );
  }
}

/**
 * Kiểm tra có thể lưu trữ.
 *
 * @param {Object} tenant
 */
export function validateArchiveTenant(
  tenant
) {
  if (!tenant) {
    throw new Error(
      "Không tìm thấy người thuê."
    );
  }

  if (tenant.archived) {
    throw new Error(
      "Người thuê đã được lưu trữ."
    );
  }
}