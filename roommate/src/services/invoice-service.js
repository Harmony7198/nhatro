/**
 * @file invoice-service.js
 * @description Service quản lý hóa đơn.
 */

import { STORAGE_KEYS } from "../constants/storage-keys.js";

import * as StorageService from "./storage-service.js";
import * as ContractService from "./contract-service.js";
import * as MeterReadingService from "./meter-reading-service.js";
import * as ServiceConfigService from "./service-config-service.js";

import {
  calculateInvoiceTotal,
  calculateSubtotal,
  calculateRemainingDebt,
  determineInvoiceStatus
} from "../business/invoice-calculator.js";

import {
  validateInvoice
} from "../business/invoice-validator.js";

/**
 * Lấy toàn bộ hóa đơn.
 *
 * @returns {Array}
 */
export function getInvoices() {

  return StorageService.getAll(
    STORAGE_KEYS.INVOICES
  );

}

/**
 * Lấy hóa đơn theo ID.
 *
 * @param {string} id
 * @returns {Object}
 */
export function getInvoiceById(id) {

  if (!id) {
    throw new Error(
      "ID hóa đơn là bắt buộc."
    );
  }

  const invoice =
    StorageService.getById(
      STORAGE_KEYS.INVOICES,
      id
    );

  if (!invoice) {
    throw new Error(
      "Không tìm thấy hóa đơn."
    );
  }

  return invoice;

}

/**
 * Lấy hóa đơn theo phòng và tháng.
 *
 * @param {string} roomId
 * @param {string} month
 * @returns {Object|null}
 */
export function getInvoiceByRoomAndMonth(
  roomId,
  month
) {

  return (
    getInvoices().find(
      (invoice) =>
        invoice.roomId === roomId &&
        invoice.monthKey === month
    ) ?? null
  );

}

/**
 * Kiểm tra hóa đơn đã tồn tại.
 *
 * @param {string} roomId
 * @param {string} month
 */
function ensureInvoiceNotExists(
  roomId,
  month
) {

  if (
    getInvoiceByRoomAndMonth(
      roomId,
      month
    )
  ) {
    throw new Error(
      "Phòng đã có hóa đơn trong tháng này."
    );
  }

}

/**
 * Lấy hợp đồng hiệu lực.
 *
 * @param {string} roomId
 * @returns {Object}
 */
function getActiveContract(
  roomId
) {

  const contract =
    ContractService.getActiveContractByRoom(
      roomId
    );

  if (!contract) {
    throw new Error(
      "Phòng không có hợp đồng hiệu lực."
    );
  }

  return contract;

}

/**
 * Lấy bản ghi điện nước.
 *
 * @param {string} roomId
 * @param {string} month
 * @returns {Object}
 */
function getMeterReading(
  roomId,
  month
) {

  const reading =
    MeterReadingService.getReadingByRoomAndMonth(
      roomId,
      month
    );

  if (!reading) {
    throw new Error(
      "Chưa có chỉ số điện nước."
    );
  }

  return reading;

}

/**
 * Lấy các dịch vụ đang áp dụng.
 *
 * @returns {Array}
 */
function getActiveServices() {

  return ServiceConfigService
    .getServices()
    .filter(
      (service) =>
        service.active !== false
    );

}

/**
 * Tạo snapshot dịch vụ.
 *
 * Snapshot giúp hóa đơn
 * không bị ảnh hưởng khi
 * cấu hình dịch vụ thay đổi.
 *
 * @param {Object} service
 * @param {number} quantity
 * @returns {Object}
 */
function createServiceSnapshot(
  service,
  quantity
) {

  return {

    serviceId:
      service.id,

    code:
      service.code,

    name:
      service.name,

    calculationType:
      service.calculationType,

    unitPrice:
      service.unitPrice,

    quantity,

    amount:
      Number(
        quantity *
        service.unitPrice
      )

  };

}

/**
 * Tính lại thông tin tiền.
 *
 * @param {Object} invoice
 * @returns {Object}
 */
function calculateInvoice(
  invoice
) {

  const subtotal =
    calculateSubtotal(
      invoice.items
    );

  const total =
    calculateInvoiceTotal(
      invoice.items,
      invoice.discount ?? 0
    );

  const remainingDebt =
    calculateRemainingDebt(
      total,
      invoice.paidAmount ?? 0
    );

  const status =
    determineInvoiceStatus(
      total,
      invoice.paidAmount ?? 0,
      invoice.dueDate,
      new Date()
    );

  return {

    ...invoice,

    subtotal,

    total,

    remainingDebt,

    status

  };

}

/**
 * Tạo item tiền thuê.
 *
 * @param {Object} contract
 * @returns {Object}
 */
function createRentItem(contract) {

  return {
    type: "rent",
    serviceId: null,
    code: "RENT",
    name: "Tiền thuê phòng",
    unitPrice: Number(contract.rentPrice),
    quantity: 1,
    amount: Number(contract.rentPrice)
  };

}

/**
 * Tạo item tiền điện.
 *
 * @param {Object} reading
 * @param {Array} services
 * @returns {Object}
 */
function createElectricItem(
  reading,
  services
) {

  const service = services.find(
    item => item.code === "ELECTRIC"
  );

  if (!service) {
    throw new Error(
      "Chưa cấu hình dịch vụ điện."
    );
  }

  return createServiceSnapshot(
    service,
    reading.electricUsage
  );

}

/**
 * Tạo item tiền nước.
 *
 * @param {Object} reading
 * @param {Array} services
 * @returns {Object}
 */
function createWaterItem(
  reading,
  services
) {

  const service = services.find(
    item => item.code === "WATER"
  );

  if (!service) {
    throw new Error(
      "Chưa cấu hình dịch vụ nước."
    );
  }

  return createServiceSnapshot(
    service,
    reading.waterUsage
  );

}

/**
 * Tạo các dịch vụ khác.
 *
 * @param {Object} contract
 * @param {Array} services
 * @returns {Array}
 */
function createAdditionalItems(
  contract,
  services
) {

  return services
    .filter(service =>
      !["ELECTRIC", "WATER"].includes(
        service.code
      )
    )
    .map(service => {

      let quantity = 1;

      switch (
        service.calculationType
      ) {

        case "perPerson":
          quantity =
            contract.tenantIds?.length ??
            1;
          break;

        case "perVehicle":
          quantity =
            contract.vehicleCount ??
            0;
          break;

        case "fixed":
          quantity = 1;
          break;

        case "manual":
          quantity = 0;
          break;

        case "usage":
          quantity = 0;
          break;

      }

      return createServiceSnapshot(
        service,
        quantity
      );

    });

}

/**
 * Tạo hóa đơn.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function createInvoice(
  data
) {

  ensureInvoiceNotExists(
    data.roomId,
    data.monthKey
  );

  const contract =
    getActiveContract(
      data.roomId
    );

  const reading =
    getMeterReading(
      data.roomId,
      data.monthKey
    );

  const services =
    getActiveServices();

  const items = [

    createRentItem(
      contract
    ),

    createElectricItem(
      reading,
      services
    ),

    createWaterItem(
      reading,
      services
    ),

    ...createAdditionalItems(
      contract,
      services
    )

  ];

  const invoice = {

    id:
      crypto.randomUUID(),

    roomId:
      data.roomId,

    contractId:
      contract.id,

    monthKey:
      data.monthKey,

    issueDate:
      data.issueDate ??
      new Date().toISOString(),

    dueDate:
      data.dueDate,

    discount:
      Number(
        data.discount ?? 0
      ),

    paidAmount: 0,

    finalized: false,

    cancelled: false,

    items,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  };

  const calculated =
    calculateInvoice(
      invoice
    );

  validateInvoice(
    calculated
  );

  StorageService.create(
    STORAGE_KEYS.INVOICES,
    calculated
  );

  return calculated;

}


/**
 * Sinh hóa đơn cho một phòng.
 *
 * @param {string} roomId
 * @param {string} month
 * @returns {Object}
 */
export function generateInvoiceForRoom(
  roomId,
  month
) {

  if (!roomId) {
    throw new Error(
      "Room ID là bắt buộc."
    );
  }

  if (!month) {
    throw new Error(
      "Tháng là bắt buộc."
    );
  }

  const existed =
    getInvoiceByRoomAndMonth(
      roomId,
      month
    );

  if (existed) {
    return existed;
  }

  const issueDate =
    new Date().toISOString();

  const dueDate =
    new Date(
      new Date(issueDate).getTime() +
      7 * 24 * 60 * 60 * 1000
    ).toISOString();

  return createInvoice({

    roomId,

    monthKey: month,

    issueDate,

    dueDate,

    discount: 0

  });

}

/**
 * Sinh hóa đơn cho toàn bộ phòng.
 *
 * Chỉ sinh cho phòng:
 * - Có hợp đồng hiệu lực
 * - Có bản ghi điện nước
 * - Chưa có hóa đơn
 *
 * @param {string} month
 * @returns {Object}
 */
export function generateInvoicesForMonth(
  month
) {

  if (!month) {
    throw new Error(
      "Tháng là bắt buộc."
    );
  }

  const contracts =
    ContractService
      .getContracts()
      .filter(contract =>
        contract.status === "active"
      );

  const created = [];

  const skipped = [];

  for (const contract of contracts) {

    try {

      const existed =
        getInvoiceByRoomAndMonth(
          contract.roomId,
          month
        );

      if (existed) {

        skipped.push({

          roomId:
            contract.roomId,

          reason:
            "Đã có hóa đơn"

        });

        continue;

      }

      MeterReadingService
        .getReadingByRoomAndMonth(
          contract.roomId,
          month
        );

      const invoice =
        generateInvoiceForRoom(

          contract.roomId,

          month

        );

      created.push(invoice);

    } catch (error) {

      skipped.push({

        roomId:
          contract.roomId,

        reason:
          error.message

      });

    }

  }

  return {

    created,

    skipped,

    totalCreated:
      created.length,

    totalSkipped:
      skipped.length

  };

}


/**
 * Kiểm tra hóa đơn có được phép sửa.
 *
 * @param {Object} invoice
 */
function ensureDraftInvoice(
  invoice
) {

  if (invoice.finalized) {
    throw new Error(
      "Hóa đơn đã chốt, không thể chỉnh sửa."
    );
  }

  if (invoice.cancelled) {
    throw new Error(
      "Hóa đơn đã hủy."
    );
  }

}

/**
 * Tính lại snapshot dịch vụ.
 *
 * @param {Object} invoice
 * @returns {Array}
 */
function rebuildInvoiceItems(
  invoice
) {

  const contract =
    getActiveContract(
      invoice.roomId
    );

  const reading =
    getMeterReading(
      invoice.roomId,
      invoice.monthKey
    );

  const services =
    getActiveServices();

  return [

    createRentItem(
      contract
    ),

    createElectricItem(
      reading,
      services
    ),

    createWaterItem(
      reading,
      services
    ),

    ...createAdditionalItems(
      contract,
      services
    )

  ];

}

/**
 * Tính lại hóa đơn.
 *
 * @param {string} id
 * @returns {Object}
 */
export function recalculateInvoice(
  id
) {

  const invoice =
    getInvoiceById(id);

  ensureDraftInvoice(
    invoice
  );

  const updated = {

    ...invoice,

    items:
      rebuildInvoiceItems(
        invoice
      ),

    updatedAt:
      new Date().toISOString()

  };

  const calculated =
    calculateInvoice(
      updated
    );

  validateInvoice(
    calculated
  );

  StorageService.update(
    STORAGE_KEYS.INVOICES,
    id,
    calculated
  );

  return calculated;

}

/**
 * Cập nhật hóa đơn nháp.
 *
 * Chỉ cho phép cập nhật:
 * - dueDate
 * - discount
 * - ghi chú
 *
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 */
export function updateDraftInvoice(
  id,
  data
) {

  const invoice =
    getInvoiceById(id);

  ensureDraftInvoice(
    invoice
  );

  const updated = {

    ...invoice,

    dueDate:
      data.dueDate ??
      invoice.dueDate,

    discount:
      data.discount ??
      invoice.discount,

    note:
      data.note ??
      invoice.note,

    updatedAt:
      new Date().toISOString()

  };

  const calculated =
    calculateInvoice(
      updated
    );

  validateInvoice(
    calculated
  );

  StorageService.update(
    STORAGE_KEYS.INVOICES,
    id,
    calculated
  );

  return calculated;

}



/**
 * Chốt hóa đơn.
 *
 * Sau khi chốt:
 * - Không được sửa nội dung
 * - Có thể ghi nhận thanh toán
 *
 * @param {string} id
 * @returns {Object}
 */
export function finalizeInvoice(
  id
) {

  const invoice =
    getInvoiceById(id);

  if (invoice.cancelled) {
    throw new Error(
      "Hóa đơn đã hủy."
    );
  }

  if (invoice.finalized) {
    return invoice;
  }

  const updated = {

    ...invoice,

    finalized: true,

    finalizedAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  };

  validateInvoice(updated);

  StorageService.update(
    STORAGE_KEYS.INVOICES,
    id,
    updated
  );

  return updated;

}

/**
 * Hủy hóa đơn.
 *
 * Chỉ hóa đơn chưa thanh toán
 * mới được phép hủy.
 *
 * @param {string} id
 * @returns {Object}
 */
export function cancelInvoice(
  id
) {

  const invoice =
    getInvoiceById(id);

    if (invoice.finalized) {
  throw new Error(
    "Không thể hủy hóa đơn đã chốt."
  );
}

  if (invoice.cancelled) {
    return invoice;
  }

  if (
    (invoice.paidAmount ?? 0) > 0
  ) {
    throw new Error(
      "Không thể hủy hóa đơn đã thanh toán."
    );
  }

  const updated = {

    ...invoice,

    cancelled: true,

    status: "cancelled",

    updatedAt:
      new Date().toISOString()

  };

  StorageService.update(
    STORAGE_KEYS.INVOICES,
    id,
    updated
  );

  return updated;

}

/**
 * Xóa hóa đơn nháp.
 *
 * Chỉ được xóa:
 * - Draft
 * - Chưa thanh toán
 * - Chưa chốt
 *
 * @param {string} id
 */
export function deleteDraftInvoice(
  id
) {

  const invoice =
    getInvoiceById(id);

  if (invoice.finalized) {
    throw new Error(
      "Không thể xóa hóa đơn đã chốt."
    );
  }

  if (invoice.cancelled) {
    throw new Error(
      "Không thể xóa hóa đơn đã hủy."
    );
  }

  if (
    (invoice.paidAmount ?? 0) > 0
  ) {
    throw new Error(
      "Không thể xóa hóa đơn đã thanh toán."
    );
  }

  StorageService.remove(
    STORAGE_KEYS.INVOICES,
    id
  );

}

/**
 * Lọc hóa đơn.
 *
 * filters:
 * {
 *   keyword,
 *   roomId,
 *   monthKey,
 *   status,
 *   finalized
 * }
 *
 * @param {Object} filters
 * @returns {Array}
 */
export function filterInvoices(filters = {}) {
  const keyword =
    (filters.keyword ?? "")
      .trim()
      .toLowerCase();

  return getInvoices().filter((invoice) => {

    if (
      filters.roomId &&
      invoice.roomId !== filters.roomId
    ) {
      return false;
    }

    if (
      filters.monthKey &&
      invoice.monthKey !== filters.monthKey
    ) {
      return false;
    }

    if (
      filters.finalized !== undefined &&
      invoice.finalized !== filters.finalized
    ) {
      return false;
    }

    if (
      filters.status &&
      determineInvoiceStatus(
        invoice.total,
        invoice.paidAmount,
        invoice.dueDate,
        new Date()
      ) !== filters.status
    ) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    return [
      invoice.id,
      invoice.roomId,
      invoice.monthKey,
      invoice.contractId,
      invoice.status
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });
}

