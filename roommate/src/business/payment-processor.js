/**
 * @file payment-processor.js
 * @description Các hàm nghiệp vụ thanh toán.
 */

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
 * Tính tổng tiền đã thanh toán.
 *
 * @param {Array} payments
 * @returns {number}
 */
export function calculateTotalPaid(
  payments = []
) {

  if (!Array.isArray(payments)) {
    throw new Error(
      "Danh sách thanh toán không hợp lệ."
    );
  }

  return payments.reduce(
    (total, payment) => {

      const amount =
        Number(
          payment.amount ?? 0
        );

      validateNumber(
        amount,
        "Số tiền thanh toán"
      );

      return total + amount;

    },
    0
  );

}

/**
 * Tính số tiền còn nợ.
 *
 * @param {number} invoiceTotal
 * @param {Array} payments
 * @returns {number}
 */
export function calculateRemainingAmount(
  invoiceTotal,
  payments = []
) {

  validateNumber(
    invoiceTotal,
    "Tổng hóa đơn"
  );

  const paid =
    calculateTotalPaid(
      payments
    );

  return Math.max(
    0,
    invoiceTotal - paid
  );

}

/**
 * Xác định trạng thái thanh toán.
 *
 * Trả về:
 * - unpaid
 * - partial
 * - paid
 * - overdue
 *
 * @param {number} invoiceTotal
 * @param {Array} payments
 * @param {string|Date} dueDate
 * @param {string|Date} currentDate
 * @returns {string}
 */
export function determinePaymentStatus(
  invoiceTotal,
  payments = [],
  dueDate,
  currentDate = new Date()
) {

  validateNumber(
    invoiceTotal,
    "Tổng hóa đơn"
  );

  const paid =
    calculateTotalPaid(
      payments
    );

  const due =
    new Date(dueDate);

  const today =
    new Date(currentDate);

  if (
    Number.isNaN(
      due.getTime()
    )
  ) {
    throw new Error(
      "Hạn thanh toán không hợp lệ."
    );
  }

  if (
    paid >= invoiceTotal
  ) {
    return "paid";
  }

  if (
    paid > 0
  ) {

    if (
      today > due
    ) {
      return "overdue";
    }

    return "partial";

  }

  if (
    today > due
  ) {
    return "overdue";
  }

  return "unpaid";

}

/**
 * Có được phép xóa giao dịch?
 *
 * @param {Object} payment
 * @param {Object} invoice
 * @returns {boolean}
 */
export function canDeletePayment(
  payment,
  invoice
) {

  if (!payment) {
    return false;
  }

  if (!invoice) {
    return false;
  }

  if (
    invoice.cancelled === true ||
    invoice.status === "cancelled"
  ) {
    return false;
  }

  /*
   * Khi xóa giao dịch,
   * PaymentService sẽ
   * tính lại paidAmount,
   * remainingDebt và status.
   */

  return true;

}

/**
 * Gom nhóm theo phương thức thanh toán.
 *
 * @param {Array} payments
 * @returns {Object}
 */
export function groupPaymentsByMethod(
  payments = []
) {

  if (!Array.isArray(payments)) {
    throw new Error(
      "Danh sách thanh toán không hợp lệ."
    );
  }

  return payments.reduce(
    (groups, payment) => {

      const method =
        payment.method ??
        "unknown";

      if (!groups[method]) {

        groups[method] = {

          method,

          count: 0,

          totalAmount: 0,

          payments: []

        };

      }

      const amount =
        Number(
          payment.amount ?? 0
        );

      validateNumber(
        amount,
        "Số tiền thanh toán"
      );

      groups[method].count++;

      groups[method].totalAmount +=
        amount;

      groups[method].payments.push(
        payment
      );

      return groups;

    },
    {}
  );

}