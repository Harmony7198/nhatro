/**
 * @file meter-calculator.js
 * @description Các hàm tính toán chỉ số điện nước.
 */

/**
 * Kiểm tra giá trị là số hợp lệ.
 *
 * @param {number} value
 * @param {string} label
 */
function validateNumber(value, label) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${label} phải là số hợp lệ.`);
  }

  if (value < 0) {
    throw new Error(`${label} không được âm.`);
  }
}

/**
 * Tính lượng sử dụng.
 *
 * @param {number} oldIndex
 * @param {number} newIndex
 * @param {string} label
 * @returns {number}
 */
export function calculateUsage(
  oldIndex,
  newIndex,
  label = "Chỉ số"
) {
  validateNumber(oldIndex, `${label} cũ`);
  validateNumber(newIndex, `${label} mới`);

  if (newIndex < oldIndex) {
    throw new Error(
      `${label} mới không được nhỏ hơn ${label.toLowerCase()} cũ.`
    );
  }

  return Number(newIndex - oldIndex);
}

/**
 * Tính lượng điện tiêu thụ.
 *
 * @param {number} oldIndex
 * @param {number} newIndex
 * @returns {number}
 */
export function calculateElectricUsage(
  oldIndex,
  newIndex
) {
  return calculateUsage(
    oldIndex,
    newIndex,
    "Chỉ số điện"
  );
}

/**
 * Tính lượng nước tiêu thụ.
 *
 * @param {number} oldIndex
 * @param {number} newIndex
 * @returns {number}
 */
export function calculateWaterUsage(
  oldIndex,
  newIndex
) {
  return calculateUsage(
    oldIndex,
    newIndex,
    "Chỉ số nước"
  );
}

/**
 * Phát hiện mức sử dụng bất thường.
 *
 * @param {number} currentUsage
 * @param {number} previousUsage
 * @param {number} thresholdPercent
 * @returns {boolean}
 */
export function detectAbnormalUsage(
  currentUsage,
  previousUsage,
  thresholdPercent = 50
) {
  validateNumber(
    currentUsage,
    "Mức sử dụng hiện tại"
  );

  validateNumber(
    previousUsage,
    "Mức sử dụng tháng trước"
  );

  validateNumber(
    thresholdPercent,
    "Ngưỡng cảnh báo"
  );

  if (thresholdPercent < 0) {
    throw new Error(
      "Ngưỡng cảnh báo không được âm."
    );
  }

  if (previousUsage === 0) {
    return currentUsage > 0;
  }

  const percent =
    ((currentUsage - previousUsage) /
      previousUsage) *
    100;

  return percent >= thresholdPercent;
}

/**
 * Lấy khóa tháng trước.
 *
 * monthKey: yyyy-MM
 *
 * @param {string} monthKey
 * @returns {string}
 */
export function getPreviousMonthKey(
  monthKey
) {
  if (typeof monthKey !== "string") {
    throw new Error(
      "Tháng phải là chuỗi."
    );
  }

  const pattern = /^\d{4}-\d{2}$/;

  if (!pattern.test(monthKey)) {
    throw new Error(
      "Định dạng tháng phải là yyyy-MM."
    );
  }

  const [year, month] =
    monthKey.split("-").map(Number);

  const date = new Date(
    year,
    month - 2,
    1
  );

  const previousYear =
    date.getFullYear();

  const previousMonth = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${previousYear}-${previousMonth}`;
}


