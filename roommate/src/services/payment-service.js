/**
 * @file payment-service.js
 * @description Service quản lý thanh toán.
 */

import { STORAGE_KEYS } from "../constants/storage-keys.js";

import * as StorageService from "./storage-service.js";
import * as InvoiceService from "./invoice-service.js";

import {
  validatePayment
} from "../business/payment-validator.js";

import {

  calculateTotalPaid,
  calculateRemainingAmount,
  determinePaymentStatus

} from "../business/payment-processor.js";

/**
 * Lấy toàn bộ giao dịch thanh toán.
 *
 * @returns {Array}
 */
export function getPayments() {

  return StorageService.getAll(
    STORAGE_KEYS.PAYMENTS
  );

}

/**
 * Lấy giao dịch theo ID.
 *
 * @param {string} id
 * @returns {Object}
 */
export function getPaymentById(
  id
) {

  if (!id) {
    throw new Error(
      "ID thanh toán là bắt buộc."
    );
  }

  const payment =
    StorageService.getById(
      STORAGE_KEYS.PAYMENTS,
      id
    );

  if (!payment) {
    throw new Error(
      "Không tìm thấy giao dịch."
    );
  }

  return payment;

}

/**
 * Lấy danh sách thanh toán theo hóa đơn.
 *
 * @param {string} invoiceId
 * @returns {Array}
 */
export function getPaymentsByInvoice(
  invoiceId
) {

  if (!invoiceId) {
    throw new Error(
      "Invoice ID là bắt buộc."
    );
  }

  return getPayments()
    .filter(
      payment =>
        payment.invoiceId ===
        invoiceId
    )
    .sort(
      (a, b) =>
        new Date(
          a.paymentDate
        ) -
        new Date(
          b.paymentDate
        )
    );

}

/**
 * Kiểm tra hóa đơn tồn tại.
 *
 * @param {string} invoiceId
 * @returns {Object}
 */
function getInvoice(
  invoiceId
) {

  return InvoiceService
    .getInvoiceById(
      invoiceId
    );

}

/**
 * Tạo object cập nhật hóa đơn.
 *
 * @param {Object} invoice
 * @param {Array} payments
 * @returns {Object}
 */
function buildInvoicePaymentState(
  invoice,
  payments
) {

  const paidAmount =
    calculateTotalPaid(
      payments
    );

  const remainingDebt =
    calculateRemainingAmount(
      invoice.total,
      payments
    );

  const status =
    determinePaymentStatus(
      invoice.total,
      payments,
      invoice.dueDate,
      new Date()
    );

  return {

    ...invoice,

    paidAmount,

    remainingDebt,

    status,

    updatedAt:
      new Date().toISOString()

  };

}

/**
 * Tạo giao dịch thanh toán.
 *
 * Quy trình:
 * 1. Kiểm tra hóa đơn
 * 2. Validate
 * 3. Lưu payment
 * 4. Đồng bộ hóa đơn
 * 5. Rollback nếu thất bại
 *
 * @param {Object} data
 * @returns {Object}
 */
export function createPayment(
  data
) {

  if (!data) {
    throw new Error(
      "Dữ liệu thanh toán không hợp lệ."
    );
  }

  const invoice =
    getInvoice(
      data.invoiceId
    );

  const payment = {

    id:
      crypto.randomUUID(),

    invoiceId:
      data.invoiceId,

    amount:
      Number(
        data.amount
      ),

    method:
      data.method,

    paymentDate:
      data.paymentDate ??
      new Date().toISOString(),

    note:
      data.note ?? "",

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  };

  const validation =
    validatePayment(
      payment,
      invoice
    );

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  StorageService.create(
    STORAGE_KEYS.PAYMENTS,
    payment
  );

  try {

    syncInvoicePaymentStatus(
      invoice.id
    );

  } catch (error) {

    /*
     * Rollback:
     * Không để tồn tại payment
     * nếu hóa đơn không cập nhật được.
     */

    StorageService.remove(
      STORAGE_KEYS.PAYMENTS,
      payment.id
    );

    throw error;

  }

  return getPaymentById(
    payment.id
  );

}


/**
 * Đồng bộ trạng thái thanh toán của hóa đơn.
 *
 * Sau khi thêm hoặc xóa payment,
 * hàm này phải được gọi để cập nhật:
 * - paidAmount
 * - remainingDebt
 * - status
 *
 * @param {string} invoiceId
 * @returns {Object}
 */
export function syncInvoicePaymentStatus(
  invoiceId
) {

  if (!invoiceId) {
    throw new Error(
      "Invoice ID là bắt buộc."
    );
  }

  const invoice =
    getInvoice(
      invoiceId
    );

  const payments =
    getPaymentsByInvoice(
      invoiceId
    );

  const updatedInvoice =
    buildInvoicePaymentState(
      invoice,
      payments
    );

  StorageService.update(
    STORAGE_KEYS.INVOICES,
    invoiceId,
    updatedInvoice
  );

  return updatedInvoice;

}

/**
 * Kiểm tra hóa đơn còn có thể nhận thanh toán.
 *
 * @param {Object} invoice
 */
function ensureInvoicePayable(
  invoice
) {

  if (!invoice) {
    throw new Error(
      "Hóa đơn không tồn tại."
    );
  }

  if (
    invoice.cancelled === true ||
    invoice.status === "cancelled"
  ) {
    throw new Error(
      "Không thể thanh toán hóa đơn đã hủy."
    );
  }

  if (
    Number(invoice.remainingDebt ?? 0) <= 0
  ) {
    throw new Error(
      "Hóa đơn đã được thanh toán đầy đủ."
    );
  }

}


import {
  canDeletePayment
} from "../business/payment-processor.js";

/**
 * Xóa giao dịch thanh toán.
 *
 * Quy trình:
 * 1. Kiểm tra giao dịch
 * 2. Kiểm tra hóa đơn
 * 3. Xóa payment
 * 4. Đồng bộ hóa đơn
 * 5. Rollback nếu đồng bộ thất bại
 *
 * @param {string} id
 */
export function deletePayment(
  id
) {

  if (!id) {
    throw new Error(
      "Payment ID là bắt buộc."
    );
  }

  const payment =
    getPaymentById(id);

  const invoice =
    getInvoice(
      payment.invoiceId
    );

  if (
    !canDeletePayment(
      payment,
      invoice
    )
  ) {
    throw new Error(
      "Không thể xóa giao dịch này."
    );
  }

  /*
   * Backup để rollback.
   */
  const backup = {
    ...payment
  };

  StorageService.remove(
    STORAGE_KEYS.PAYMENTS,
    id
  );

  try {

    syncInvoicePaymentStatus(
      payment.invoiceId
    );

  } catch (error) {

    /*
     * Rollback payment.
     */
    StorageService.create(
      STORAGE_KEYS.PAYMENTS,
      backup
    );

    throw error;

  }

}

/**
 * Kiểm tra payment thuộc hóa đơn.
 *
 * @param {string} paymentId
 * @param {string} invoiceId
 * @returns {boolean}
 */
function belongsToInvoice(
  paymentId,
  invoiceId
) {

  try {

    const payment =
      getPaymentById(
        paymentId
      );

    return (
      payment.invoiceId ===
      invoiceId
    );

  } catch {

    return false;

  }

}


/**
 * Lọc giao dịch thanh toán.
 *
 * filters:
 * {
 *   invoiceId,
 *   method,
 *   fromDate,
 *   toDate,
 *   keyword
 * }
 *
 * @param {Object} filters
 * @returns {Array}
 */
export function filterPayments(
  filters = {}
) {

  const keyword =
    String(
      filters.keyword ?? ""
    )
      .trim()
      .toLowerCase();

  return getPayments()
    .filter(payment => {

      if (
        filters.invoiceId &&
        payment.invoiceId !==
          filters.invoiceId
      ) {
        return false;
      }

      if (
        filters.method &&
        payment.method !==
          filters.method
      ) {
        return false;
      }

      if (
        filters.fromDate
      ) {

        const from =
          new Date(
            filters.fromDate
          );

        if (
          new Date(
            payment.paymentDate
          ) < from
        ) {
          return false;
        }

      }

      if (
        filters.toDate
      ) {

        const to =
          new Date(
            filters.toDate
          );

        if (
          new Date(
            payment.paymentDate
          ) > to
        ) {
          return false;
        }

      }

      if (!keyword) {
        return true;
      }

      return [

        payment.id,

        payment.invoiceId,

        payment.method,

        payment.note

      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);

    })
    .sort(
      (a, b) =>
        new Date(
          b.paymentDate
        ) -
        new Date(
          a.paymentDate
        )
    );

}

/**
 * Tổng tiền đã thanh toán
 * của một hóa đơn.
 *
 * @param {string} invoiceId
 * @returns {number}
 */
export function getTotalPaidByInvoice(
  invoiceId
) {

  if (!invoiceId) {
    throw new Error(
      "Invoice ID là bắt buộc."
    );
  }

  return calculateTotalPaid(
    getPaymentsByInvoice(
      invoiceId
    )
  );

}