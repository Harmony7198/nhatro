/**
 * @file service-config-service.js
 * @description Service quản lý cấu hình dịch vụ.
 */

import { STORAGE_KEYS } from "../constants/storage-keys.js";

import * as StorageService from "./storage-service.js";

import {
  validateServiceConfig
} from "../business/service-config-validator.js";

/**
 * Lấy toàn bộ dịch vụ.
 *
 * @returns {Array}
 */
export function getServices() {
  return StorageService.getAll(
    STORAGE_KEYS.SERVICE_CONFIGS
  );
}

/**
 * Lấy dịch vụ theo ID.
 *
 * @param {string} id
 * @returns {Object}
 */
export function getServiceById(id) {

  if (!id) {
    throw new Error(
      "ID dịch vụ là bắt buộc."
    );
  }

  const service =
    StorageService.getById(
      STORAGE_KEYS.SERVICE_CONFIGS,
      id
    );

  if (!service) {
    throw new Error(
      "Không tìm thấy dịch vụ."
    );
  }

  return service;

}

/**
 * Tìm kiếm dịch vụ.
 *
 * Theo mã hoặc tên.
 *
 * @param {string} keyword
 * @returns {Array}
 */
export function searchServices(
  keyword = ""
) {

  const text =
    keyword
      .trim()
      .toLowerCase();

  if (!text) {
    return getServices();
  }

  return getServices().filter(
    (service) =>
      service.code
        ?.toLowerCase()
        .includes(text) ||
      service.name
        ?.toLowerCase()
        .includes(text)
  );

}

/**
 * Lọc theo trạng thái.
 *
 * @param {Object} filters
 * @returns {Array}
 */
export function filterServices(
  filters = {}
) {

  let services =
    getServices();

  if (
    filters.active !== undefined
  ) {

    services =
      services.filter(
        (service) =>
          service.active ===
          filters.active
      );

  }

  return services;

}

/**
 * Validate trước khi lưu.
 *
 * @param {Object} service
 * @param {string|null} ignoreId
 * @returns {Object}
 */
function validateBeforeSave(
  service,
  ignoreId = null
) {

  return validateServiceConfig(
    service,
    {
      existingServices:
        getServices(),
      ignoreId
    }
  );

}

/**
 * Kiểm tra dịch vụ đã được
 * sử dụng trong hóa đơn hay chưa.
 *
 * @param {string} serviceId
 * @returns {boolean}
 */
function hasInvoiceReference(
  serviceId
) {

  const invoices =
    StorageService.getAll(
      STORAGE_KEYS.INVOICES
    );

  return invoices.some(
    (invoice) =>
      (invoice.services ?? [])
        .some(
          (item) =>
            item.serviceId ===
            serviceId
        )
  );

}

/**
 * Tạo dịch vụ mới.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function createService(data) {

  const service =
    validateBeforeSave({
      ...data,
      active:
        data.active ?? true
    });

  return StorageService.create(
    STORAGE_KEYS.SERVICE_CONFIGS,
    service
  );

}

/**
 * Cập nhật dịch vụ.
 *
 * @param {string} id
 * @param {Object} changes
 * @returns {Object}
 */
export function updateService(
  id,
  changes
) {

  const current =
    getServiceById(id);

  const updated =
    validateBeforeSave(
      {
        ...current,
        ...changes,
        id
      },
      id
    );

  return StorageService.update(
    STORAGE_KEYS.SERVICE_CONFIGS,
    id,
    updated
  );

}

/**
 * Ngưng áp dụng dịch vụ.
 *
 * Không xóa dữ liệu để
 * bảo toàn lịch sử hóa đơn.
 *
 * @param {string} id
 * @returns {Object}
 */
export function deactivateService(id) {

  getServiceById(id);

  return StorageService.update(
    STORAGE_KEYS.SERVICE_CONFIGS,
    id,
    {
      active: false
    }
  );

}

/**
 * Kích hoạt lại dịch vụ.
 *
 * @param {string} id
 * @returns {Object}
 */
export function activateService(id) {

  getServiceById(id);

  return StorageService.update(
    STORAGE_KEYS.SERVICE_CONFIGS,
    id,
    {
      active: true
    }
  );

}

/**
 * Xóa dịch vụ.
 *
 * Chỉ được xóa cứng khi
 * chưa từng xuất hiện
 * trong hóa đơn.
 *
 * @param {string} id
 */
export function deleteService(id) {

  getServiceById(id);

  if (
    hasInvoiceReference(id)
  ) {

    throw new Error(
      "Dịch vụ đã được sử dụng trong hóa đơn và không thể xóa."
    );

  }

  StorageService.remove(
    STORAGE_KEYS.SERVICE_CONFIGS,
    id
  );

}


/**
 * Lấy danh sách dịch vụ đang áp dụng.
 *
 * @returns {Array}
 */
export function getActiveServices() {
  return getServices().filter(
    (service) => service.active === true
  );
}

/**
 * Lấy danh sách dịch vụ đã ngưng áp dụng.
 *
 * @returns {Array}
 */
export function getInactiveServices() {
  return getServices().filter(
    (service) => service.active === false
  );
}

/**
 * Kiểm tra mã dịch vụ đã tồn tại.
 *
 * @param {string} code
 * @param {string|null} ignoreId
 * @returns {boolean}
 */
export function existsServiceCode(
  code,
  ignoreId = null
) {
  const normalized = code
    ?.trim()
    .toUpperCase()
    .replace(/\s+/g, "");

  return getServices().some((service) => {
    if (
      ignoreId &&
      service.id === ignoreId
    ) {
      return false;
    }

    return (
      service.code
        ?.trim()
        .toUpperCase()
        .replace(/\s+/g, "") === normalized
    );
  });
}

/**
 * Đảo trạng thái hoạt động.
 *
 * @param {string} id
 * @returns {Object}
 */
export function toggleServiceStatus(id) {
  const service =
    getServiceById(id);

  return StorageService.update(
    STORAGE_KEYS.SERVICE_CONFIGS,
    id,
    {
      active: !service.active
    }
  );
}

/**
 * Trả về danh sách dùng cho select.
 *
 * @param {boolean} activeOnly
 * @returns {Array}
 */
export function getServiceOptions(
  activeOnly = true
) {
  const services = activeOnly
    ? getActiveServices()
    : getServices();

  return services
    .slice()
    .sort((a, b) =>
      a.name.localeCompare(
        b.name,
        "vi"
      )
    )
    .map((service) => ({
      value: service.id,
      label: `${service.code} - ${service.name}`,
      service
    }));
}

/**
 * Lấy dịch vụ theo cách tính.
 *
 * @param {string} calculationType
 * @returns {Array}
 */
export function getServicesByCalculationType(
  calculationType
) {
  return getServices().filter(
    (service) =>
      service.calculationType ===
      calculationType
  );
}

/**
 * Đếm số dịch vụ.
 *
 * @returns {number}
 */
export function countServices() {
  return getServices().length;
}

/**
 * Đếm số dịch vụ đang hoạt động.
 *
 * @returns {number}
 */
export function countActiveServices() {
  return getActiveServices().length;
}

/**
 * Đếm số dịch vụ đã ngưng áp dụng.
 *
 * @returns {number}
 */
export function countInactiveServices() {
  return getInactiveServices().length;
}

/**
 * Kiểm tra có dịch vụ nào hay không.
 *
 * @returns {boolean}
 */
export function hasServices() {
  return countServices() > 0;
}

/**
 * Lấy thống kê.
 *
 * @returns {Object}
 */
export function getServiceStatistics() {
  return {
    total: countServices(),
    active: countActiveServices(),
    inactive: countInactiveServices(),
    calculationTypes: {
      usage: getServicesByCalculationType("usage").length,
      fixed: getServicesByCalculationType("fixed").length,
      perPerson: getServicesByCalculationType("perPerson").length,
      perVehicle: getServicesByCalculationType("perVehicle").length,
      manual: getServicesByCalculationType("manual").length
    }
  };
}


