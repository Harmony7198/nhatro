/**
 * @file payment-validator.js
 * @description Business validation cho thanh toán.
 */

/**
 * Kiểm tra dữ liệu thanh toán.
 *
 * @param {Object} payment
 * @param {Object} invoice
 * @returns {{valid:boolean, errors:string[]}}
 */
export function validatePayment(
  payment,
  invoice
) {

  const errors = [];

  if (!payment) {
    return {
      valid: false,
      errors: [
        "Thông tin thanh toán không tồn tại."
      ]
    };
  }

  if (!invoice) {
    return {
      valid: false,
      errors: [
        "Hóa đơn không tồn tại."
      ]
    };
  }

  const amount =
    Number(payment.amount);

  if (
    Number.isNaN(amount)
  ) {
    errors.push(
      "Số tiền thanh toán không hợp lệ."
    );
  }

  if (
    amount <= 0
  ) {
    errors.push(
      "Số tiền thanh toán phải lớn hơn 0."
    );
  }

  if (
    invoice.cancelled === true ||
    invoice.status === "cancelled"
  ) {
    errors.push(
      "Không thể thanh toán hóa đơn đã hủy."
    );
  }

  const paidAmount =
    Number(
      invoice.paidAmount ?? 0
    );

  const total =
    Number(
      invoice.total ?? 0
    );

  if (
    paidAmount >= total
  ) {
    errors.push(
      "Hóa đơn đã được thanh toán đầy đủ."
    );
  }

  const remaining =
    total - paidAmount;

  if (
    amount > remaining
  ) {
    errors.push(
      "Số tiền thanh toán vượt quá công nợ còn lại."
    );
  }

  if (
    !payment.method ||
    String(payment.method).trim() === ""
  ) {
    errors.push(
      "Phương thức thanh toán là bắt buộc."
    );
  }

  if (
    !payment.paymentDate
  ) {
    errors.push(
      "Ngày thanh toán là bắt buộc."
    );
  }

  return {

    valid:
      errors.length === 0,

    errors

  };

}