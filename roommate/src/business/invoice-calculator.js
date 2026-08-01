/**
 * @file invoice-calculator.js
 * @description Các hàm tính toán hóa đơn.
 */

/**
 * Kiểm tra số hợp lệ.
 *
 * @param {number} value
 * @param {string} label
 */
function validateNumber(value, label) {

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
 * Tính tiền điện.
 *
 * @param {number} usage
 * @param {number} unitPrice
 * @returns {number}
 */
export function calculateElectricAmount(
  usage,
  unitPrice
) {

  validateNumber(
    usage,
    "Sản lượng điện"
  );

  validateNumber(
    unitPrice,
    "Đơn giá điện"
  );

  return Number(
    usage * unitPrice
  );

}

/**
 * Tính tiền nước.
 *
 * @param {number} usage
 * @param {number} unitPrice
 * @returns {number}
 */
export function calculateWaterAmount(
  usage,
  unitPrice
) {

  validateNumber(
    usage,
    "Sản lượng nước"
  );

  validateNumber(
    unitPrice,
    "Đơn giá nước"
  );

  return Number(
    usage * unitPrice
  );

}

/**
 * Dịch vụ cố định.
 *
 * @param {number} unitPrice
 * @returns {number}
 */
export function calculateFixedServiceAmount(
  unitPrice
) {

  validateNumber(
    unitPrice,
    "Đơn giá dịch vụ"
  );

  return Number(unitPrice);

}

/**
 * Dịch vụ theo đầu người.
 *
 * @param {number} personCount
 * @param {number} unitPrice
 * @returns {number}
 */
export function calculatePerPersonAmount(
  personCount,
  unitPrice
) {

  validateNumber(
    personCount,
    "Số người"
  );

  validateNumber(
    unitPrice,
    "Đơn giá"
  );

  return Number(
    personCount * unitPrice
  );

}

/**
 * Dịch vụ theo xe.
 *
 * @param {number} vehicleCount
 * @param {number} unitPrice
 * @returns {number}
 */
export function calculatePerVehicleAmount(
  vehicleCount,
  unitPrice
) {

  validateNumber(
    vehicleCount,
    "Số xe"
  );

  validateNumber(
    unitPrice,
    "Đơn giá"
  );

  return Number(
    vehicleCount * unitPrice
  );

}

/**
 * Tính tạm tính.
 *
 * items:
 * [
 *   {
 *      amount: number
 *   }
 * ]
 *
 * @param {Array} items
 * @returns {number}
 */
export function calculateSubtotal(
  items
) {

  if (!Array.isArray(items)) {
    throw new Error(
      "Danh sách dịch vụ không hợp lệ."
    );
  }

  return items.reduce(
    (sum, item) => {

      validateNumber(
        item.amount,
        "Thành tiền"
      );

      return sum + item.amount;

    },
    0
  );

}


/**
 * Tính giảm giá.
 *
 * @param {number} subtotal
 * @param {number} discount
 * @returns {number}
 */
export function calculateDiscount(
  subtotal,
  discount = 0
) {

  validateNumber(
    subtotal,
    "Tạm tính"
  );

  validateNumber(
    discount,
    "Giảm giá"
  );

  if (discount > subtotal) {
    throw new Error(
      "Giảm giá không được lớn hơn tạm tính."
    );
  }

  return Number(discount);

}

/**
 * Tính tổng tiền hóa đơn.
 *
 * @param {Array} items
 * @param {number} discount
 * @returns {number}
 */
export function calculateInvoiceTotal(
  items,
  discount = 0
) {

  const subtotal =
    calculateSubtotal(items);

  const discountAmount =
    calculateDiscount(
      subtotal,
      discount
    );

  const total =
    subtotal - discountAmount;

  if (total < 0) {
    throw new Error(
      "Tổng tiền không được nhỏ hơn 0."
    );
  }

  return Number(total);

}

/**
 * Tính công nợ còn lại.
 *
 * @param {number} total
 * @param {number} paidAmount
 * @returns {number}
 */
export function calculateRemainingDebt(
  total,
  paidAmount = 0
) {

  validateNumber(
    total,
    "Tổng tiền"
  );

  validateNumber(
    paidAmount,
    "Số tiền đã thanh toán"
  );

  const debt =
    total - paidAmount;

  return Number(
    Math.max(0, debt)
  );

}

/**
 * Xác định trạng thái hóa đơn.
 *
 * Trả về:
 * - unpaid
 * - partial
 * - paid
 * - overdue
 *
 * @param {number} total
 * @param {number} paidAmount
 * @param {string|Date} dueDate
 * @param {string|Date} currentDate
 * @returns {string}
 */
export function determineInvoiceStatus(
  total,
  paidAmount,
  dueDate,
  currentDate = new Date()
) {

  validateNumber(
    total,
    "Tổng tiền"
  );

  validateNumber(
    paidAmount,
    "Số tiền đã thanh toán"
  );

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

  if (
    Number.isNaN(today.getTime())
  ) {
    throw new Error(
      "Ngày hiện tại không hợp lệ."
    );
  }

  if (paidAmount >= total) {
    return "paid";
  }

  if (paidAmount > 0) {

    if (today > due) {
      return "overdue";
    }

    return "partial";

  }

  if (today > due) {
    return "overdue";
  }

  return "unpaid";

}