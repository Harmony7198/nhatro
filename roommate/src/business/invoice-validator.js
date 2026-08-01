/**
 * @file invoice-validator.js
 * @description Kiểm tra tính hợp lệ của hóa đơn.
 */

import {
  calculateSubtotal,
  calculateDiscount,
  calculateInvoiceTotal,
  calculateRemainingDebt,
  determineInvoiceStatus
} from "./invoice-calculator.js";

/**
 * Kiểm tra số hợp lệ.
 *
 * @param {number} value
 * @param {string} label
 */
function validateNumber(
  value,
  label
) {

  if (
    typeof value !== "number" ||
    Number.isNaN(value)
  ) {
    throw new Error(
      `${label} phải là số hợp lệ.`
    );
  }

  if (value < 0) {
    throw new Error(
      `${label} không được âm.`
    );
  }

}

/**
 * Kiểm tra ngày.
 *
 * @param {string|Date} value
 * @param {string} label
 */
function validateDate(
  value,
  label
) {

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      `${label} không hợp lệ.`
    );
  }

}

/**
 * Kiểm tra hóa đơn.
 *
 * invoice:
 * {
 *   roomId,
 *   monthKey,
 *   issueDate,
 *   dueDate,
 *   items,
 *   discount,
 *   paidAmount
 * }
 *
 * @param {Object} invoice
 * @returns {Object}
 */
export function validateInvoice(
  invoice
) {

  if (
    !invoice ||
    typeof invoice !== "object"
  ) {
    throw new Error(
      "Hóa đơn không hợp lệ."
    );
  }

  if (
    !invoice.roomId
  ) {
    throw new Error(
      "Phòng là bắt buộc."
    );
  }

  if (
    !invoice.monthKey
  ) {
    throw new Error(
      "Tháng là bắt buộc."
    );
  }

  validateDate(
    invoice.issueDate,
    "Ngày lập"
  );

  validateDate(
    invoice.dueDate,
    "Hạn thanh toán"
  );

  if (
    new Date(invoice.dueDate) <
    new Date(invoice.issueDate)
  ) {
    throw new Error(
      "Hạn thanh toán phải sau hoặc bằng ngày lập."
    );
  }

  if (
    !Array.isArray(
      invoice.items
    )
  ) {
    throw new Error(
      "Danh sách dịch vụ không hợp lệ."
    );
  }

  invoice.items.forEach(
    (item, index) => {

      if (
        !item ||
        typeof item !== "object"
      ) {
        throw new Error(
          `Dòng ${index + 1} không hợp lệ.`
        );
      }

      if (
        !item.name
      ) {
        throw new Error(
          `Tên dịch vụ dòng ${index + 1} là bắt buộc.`
        );
      }

      validateNumber(
        item.amount,
        `Thành tiền dòng ${index + 1}`
      );

    }
  );

  validateNumber(
    invoice.discount ?? 0,
    "Giảm giá"
  );

  validateNumber(
    invoice.paidAmount ?? 0,
    "Số tiền đã thanh toán"
  );

  const subtotal =
    calculateSubtotal(
      invoice.items
    );

  calculateDiscount(
    subtotal,
    invoice.discount ?? 0
  );

  const total =
    calculateInvoiceTotal(
      invoice.items,
      invoice.discount ?? 0
    );

  if (
    invoice.paidAmount >
    total
  ) {
    throw new Error(
      "Số tiền thanh toán không được lớn hơn tổng tiền."
    );
  }

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
      invoice.currentDate ??
      new Date()
    );

  return {

    valid: true,

    subtotal,

    discount:
      invoice.discount ?? 0,

    total,

    paidAmount:
      invoice.paidAmount ?? 0,

    remainingDebt,

    status

  };

}