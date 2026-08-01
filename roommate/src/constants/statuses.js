/**
 * Trạng thái phòng
 */
export const ROOM_STATUS = Object.freeze({
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  MAINTENANCE: "maintenance"
});

export const ROOM_STATUS_LABEL = Object.freeze({
  [ROOM_STATUS.AVAILABLE]: "Trống",
  [ROOM_STATUS.OCCUPIED]: "Đang thuê",
  [ROOM_STATUS.MAINTENANCE]: "Bảo trì"
});

/**
 * Trạng thái người thuê
 */
export const TENANT_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive"
});

export const TENANT_STATUS_LABEL = Object.freeze({
  [TENANT_STATUS.ACTIVE]: "Đang thuê",
  [TENANT_STATUS.INACTIVE]: "Đã rời"
});

/**
 * Trạng thái hợp đồng
 */
export const CONTRACT_STATUS = Object.freeze({
  ACTIVE: "active",
  EXPIRED: "expired",
  TERMINATED: "terminated"
});

export const CONTRACT_STATUS_LABEL = Object.freeze({
  [CONTRACT_STATUS.ACTIVE]: "Hiệu lực",
  [CONTRACT_STATUS.EXPIRED]: "Hết hạn",
  [CONTRACT_STATUS.TERMINATED]: "Đã kết thúc"
});

/**
 * Trạng thái hóa đơn
 */
export const INVOICE_STATUS = Object.freeze({
  UNPAID: "unpaid",
  PARTIALLY_PAID: "partiallyPaid",
  PAID: "paid",
  OVERDUE: "overdue"
});

export const INVOICE_STATUS_LABEL = Object.freeze({
  [INVOICE_STATUS.UNPAID]: "Chưa thanh toán",
  [INVOICE_STATUS.PARTIALLY_PAID]: "Thanh toán một phần",
  [INVOICE_STATUS.PAID]: "Đã thanh toán",
  [INVOICE_STATUS.OVERDUE]: "Quá hạn"
});