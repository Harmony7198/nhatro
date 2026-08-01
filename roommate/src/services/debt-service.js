/**
 * @file debt-service.js
 * @description Dịch vụ theo dõi công nợ.
 */

import * as InvoiceService from "./invoice-service.js";

/**
 * Chỉ lấy các hóa đơn còn nợ.
 *
 * @returns {Array}
 */
export function getOutstandingInvoices() {

  return InvoiceService
    .getInvoices()
    .filter(invoice => {

      const remaining =
        Number(
          invoice.remainingDebt ?? 0
        );

      return (
        remaining > 0 &&
        invoice.status !== "cancelled"
      );

    });

}

/**
 * Tính số ngày quá hạn.
 *
 * @param {string|Date} dueDate
 * @param {string|Date} currentDate
 * @returns {number}
 */
export function calculateDaysOverdue(
  dueDate,
  currentDate = new Date()
) {

  const due =
    new Date(dueDate);

  const today =
    new Date(currentDate);

  if (
    Number.isNaN(due.getTime())
  ) {
    throw new Error(
      "Hạn thanh toán không hợp lệ."
    );
  }

  due.setHours(
    0,
    0,
    0,
    0
  );

  today.setHours(
    0,
    0,
    0,
    0
  );

  const diff =
    today.getTime() -
    due.getTime();

  if (diff <= 0) {
    return 0;
  }

  return Math.floor(
    diff /
    (1000 * 60 * 60 * 24)
  );

}

/**
 * Kiểm tra hóa đơn quá hạn.
 *
 * @param {Object} invoice
 * @param {Date|string} currentDate
 * @returns {boolean}
 */
function isOverdue(
  invoice,
  currentDate = new Date()
) {

  return (
    calculateDaysOverdue(
      invoice.dueDate,
      currentDate
    ) > 0 &&
    Number(
      invoice.remainingDebt ?? 0
    ) > 0
  );

}

/**
 * Chuẩn hóa dữ liệu công nợ
 * để giao diện sử dụng.
 *
 * @param {Object} invoice
 * @param {Date|string} currentDate
 * @returns {Object}
 */
function mapDebtRecord(
  invoice,
  currentDate = new Date()
) {

  return {

    ...invoice,

    remainingDebt:
      Number(
        invoice.remainingDebt ?? 0
      ),

    paidAmount:
      Number(
        invoice.paidAmount ?? 0
      ),

    total:
      Number(
        invoice.total ?? 0
      ),

    overdueDays:
      calculateDaysOverdue(
        invoice.dueDate,
        currentDate
      ),

    overdue:
      isOverdue(
        invoice,
        currentDate
      )

  };

}

/**
 * Lấy danh sách hóa đơn quá hạn.
 *
 * @param {Date|string} currentDate
 * @returns {Array}
 */
export function getOverdueInvoices(
  currentDate = new Date()
) {

  return getOutstandingInvoices()

    .filter(
      invoice =>
        isOverdue(
          invoice,
          currentDate
        )
    )

    .map(
      invoice =>
        mapDebtRecord(
          invoice,
          currentDate
        )
    )

    .sort(
      (a, b) => {

        if (
          b.remainingDebt !==
          a.remainingDebt
        ) {
          return (
            b.remainingDebt -
            a.remainingDebt
          );
        }

        return (
          b.overdueDays -
          a.overdueDays
        );

      }
    );

}

/**
 * Tổng công nợ hiện tại.
 *
 * @returns {number}
 */
export function getTotalDebt() {

  return getOutstandingInvoices()

    .reduce(

      (sum, invoice) =>

        sum +
        Number(
          invoice.remainingDebt ?? 0
        ),

      0

    );

}

/**
 * Đếm số hóa đơn còn nợ.
 *
 * Helper dùng cho Dashboard/Page.
 *
 * @returns {number}
 */
export function getOutstandingInvoiceCount() {

  return getOutstandingInvoices()
    .length;

}

/**
 * Đếm số hóa đơn quá hạn.
 *
 * Helper dùng cho Dashboard/Page.
 *
 * @param {Date|string} currentDate
 * @returns {number}
 */
export function getOverdueInvoiceCount(
  currentDate = new Date()
) {

  return getOverdueInvoices(
    currentDate
  ).length;

}

/**
 * Tổng hợp công nợ theo phòng.
 *
 * @returns {Array}
 */
export function getDebtByRoom() {

  const roomMap =
    new Map();

  getOutstandingInvoices()
    .forEach(invoice => {

      const roomId =
        invoice.roomId ??
        "UNKNOWN";

      if (
        !roomMap.has(roomId)
      ) {

        roomMap.set(
          roomId,
          {
            roomId,
            invoiceCount: 0,
            totalDebt: 0,
            overdueInvoices: 0,
            maxOverdueDays: 0,
            invoices: []
          }
        );

      }

      const item =
        roomMap.get(
          roomId
        );

      const debt =
        Number(
          invoice.remainingDebt ?? 0
        );

      const overdueDays =
        calculateDaysOverdue(
          invoice.dueDate
        );

      item.invoiceCount++;

      item.totalDebt +=
        debt;

      if (
        overdueDays > 0
      ) {

        item.overdueInvoices++;

      }

      item.maxOverdueDays =
        Math.max(
          item.maxOverdueDays,
          overdueDays
        );

      item.invoices.push(
        mapDebtRecord(
          invoice
        )
      );

    });

  return [
    ...roomMap.values()
  ].sort(
    (a, b) =>
      b.totalDebt -
      a.totalDebt
  );

}

/**
 * Tổng hợp công nợ theo tháng.
 *
 * @returns {Array}
 */
export function getDebtByMonth() {

  const monthMap =
    new Map();

  getOutstandingInvoices()
    .forEach(invoice => {

      const month =

        invoice.month ??

        (
          invoice.invoiceMonth ??

          invoice.period ??

          ""
        );

      if (
        !monthMap.has(
          month
        )
      ) {

        monthMap.set(
          month,
          {
            month,
            invoiceCount: 0,
            totalDebt: 0,
            overdueInvoices: 0,
            invoices: []
          }
        );

      }

      const item =
        monthMap.get(
          month
        );

      item.invoiceCount++;

      item.totalDebt +=
        Number(
          invoice.remainingDebt ?? 0
        );

      if (
        calculateDaysOverdue(
          invoice.dueDate
        ) > 0
      ) {

        item.overdueInvoices++;

      }

      item.invoices.push(
        mapDebtRecord(
          invoice
        )
      );

    });

  return [
    ...monthMap.values()
  ].sort(
    (a, b) => {

      if (
        b.totalDebt !==
        a.totalDebt
      ) {

        return (
          b.totalDebt -
          a.totalDebt
        );

      }

      return String(
        b.month
      ).localeCompare(
        String(
          a.month
        )
      );

    });

}