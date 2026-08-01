/**
 * @file meter-validator.js
 * @description Validator nghiệp vụ cho chỉ số điện nước.
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
 * Kiểm tra bản ghi chỉ số.
 *
 * Các trường bắt buộc:
 * - roomId
 * - monthKey
 * - electricOldIndex
 * - electricNewIndex
 * - waterOldIndex
 * - waterNewIndex
 *
 * @param {Object} reading
 * @returns {Object}
 */
export function validateMeterReading(reading) {
  if (!reading || typeof reading !== "object") {
    throw new Error("Dữ liệu chỉ số không hợp lệ.");
  }

  const {
    roomId,
    monthKey,
    electricOldIndex,
    electricNewIndex,
    waterOldIndex,
    waterNewIndex
  } = reading;

  if (
    typeof roomId !== "string" ||
    !roomId.trim()
  ) {
    throw new Error("Phòng là bắt buộc.");
  }

  if (
    typeof monthKey !== "string" ||
    !/^\d{4}-\d{2}$/.test(monthKey)
  ) {
    throw new Error(
      "Tháng phải có định dạng yyyy-MM."
    );
  }

  validateNumber(
    electricOldIndex,
    "Chỉ số điện cũ"
  );

  validateNumber(
    electricNewIndex,
    "Chỉ số điện mới"
  );

  validateNumber(
    waterOldIndex,
    "Chỉ số nước cũ"
  );

  validateNumber(
    waterNewIndex,
    "Chỉ số nước mới"
  );

  if (electricNewIndex < electricOldIndex) {
    throw new Error(
      "Chỉ số điện mới không được nhỏ hơn chỉ số điện cũ."
    );
  }

  if (waterNewIndex < waterOldIndex) {
    throw new Error(
      "Chỉ số nước mới không được nhỏ hơn chỉ số nước cũ."
    );
  }

  return {
    ...reading
  };
}

/**
 * Kiểm tra chỉ số hiện tại
 * so với kỳ trước.
 *
 * @param {Object} currentReading
 * @param {Object} previousReading
 * @returns {boolean}
 */
export function validatePreviousIndex(
  currentReading,
  previousReading
) {
  validateMeterReading(currentReading);

  if (!previousReading) {
    return true;
  }

  validateMeterReading(previousReading);

  if (
    currentReading.electricOldIndex !==
    previousReading.electricNewIndex
  ) {
    throw new Error(
      "Chỉ số điện đầu kỳ phải bằng chỉ số cuối kỳ trước."
    );
  }

  if (
    currentReading.waterOldIndex !==
    previousReading.waterNewIndex
  ) {
    throw new Error(
      "Chỉ số nước đầu kỳ phải bằng chỉ số cuối kỳ trước."
    );
  }

  return true;
}