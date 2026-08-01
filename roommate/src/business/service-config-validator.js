/**
 * @file service-config-validator.js
 * @description Validator nghiệp vụ cho cấu hình dịch vụ.
 */

export const SERVICE_CALCULATION_TYPES = Object.freeze({
  USAGE: "usage",
  FIXED: "fixed",
  PER_PERSON: "perPerson",
  PER_VEHICLE: "perVehicle",
  MANUAL: "manual"
});

const VALID_TYPES = Object.values(
  SERVICE_CALCULATION_TYPES
);

/**
 * Chuẩn hóa mã dịch vụ.
 *
 * @param {string} code
 * @returns {string}
 */
export function normalizeServiceCode(code) {
  if (typeof code !== "string") {
    return "";
  }

  return code
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

/**
 * Chuẩn hóa tên.
 *
 * @param {string} name
 * @returns {string}
 */
export function normalizeServiceName(name) {
  if (typeof name !== "string") {
    return "";
  }

  return name.trim();
}

/**
 * Chuẩn hóa đơn giá.
 *
 * @param {number|string} value
 * @returns {number}
 */
export function normalizeUnitPrice(value) {
  const price = Number(value);

  if (Number.isNaN(price)) {
    throw new Error("Đơn giá không hợp lệ.");
  }

  return price;
}

/**
 * Kiểm tra loại tính phí.
 *
 * @param {string} type
 */
export function validateCalculationType(type) {
  if (!VALID_TYPES.includes(type)) {
    throw new Error("Cách tính dịch vụ không hợp lệ.");
  }
}

/**
 * Kiểm tra đơn giá.
 *
 * @param {number} price
 */
export function validateUnitPrice(price) {
  if (price < 0) {
    throw new Error(
      "Đơn giá không được âm."
    );
  }
}

/**
 * Kiểm tra tên.
 *
 * @param {string} name
 */
export function validateServiceName(name) {
  if (!name.trim()) {
    throw new Error(
      "Tên dịch vụ là bắt buộc."
    );
  }
}

/**
 * Kiểm tra mã.
 *
 * @param {string} code
 */
export function validateServiceCode(code) {
  if (!code.trim()) {
    throw new Error(
      "Mã dịch vụ là bắt buộc."
    );
  }
}

/**
 * Kiểm tra mã trùng.
 *
 * @param {string} code
 * @param {Array} services
 * @param {string|null} ignoreId
 */
export function validateDuplicateCode(
  code,
  services,
  ignoreId = null
) {
  const normalized =
    normalizeServiceCode(code);

  const duplicated =
    services.some((service) => {

      if (
        ignoreId &&
        service.id === ignoreId
      ) {
        return false;
      }

      return (
        normalizeServiceCode(
          service.code
        ) === normalized
      );

    });

  if (duplicated) {
    throw new Error(
      "Mã dịch vụ đã tồn tại."
    );
  }
}

/**
 * Validate toàn bộ.
 *
 * @param {Object} service
 * @param {Object} options
 *
 * @returns {Object}
 */
export function validateServiceConfig(
  service,
  {
    existingServices = [],
    ignoreId = null
  } = {}
) {

  const normalized = {

    ...service,

    code:
      normalizeServiceCode(
        service.code
      ),

    name:
      normalizeServiceName(
        service.name
      ),

    unitPrice:
      normalizeUnitPrice(
        service.unitPrice
      )

  };

  validateServiceCode(
    normalized.code
  );

  validateServiceName(
    normalized.name
  );

  validateUnitPrice(
    normalized.unitPrice
  );

  validateCalculationType(
    normalized.calculationType
  );

  validateDuplicateCode(
    normalized.code,
    existingServices,
    ignoreId
  );

  return normalized;

}