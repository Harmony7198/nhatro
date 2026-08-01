/**
 * @file meter-reading-form.js
 * @description Form thêm/sửa chỉ số điện nước.
 */

import { Modal } from "bootstrap";

import {
  calculateElectricUsage,
  calculateWaterUsage
} from "../business/meter-calculator.js";

let modalElement = null;
let modalInstance = null;
let formElement = null;

let currentReading = null;
let submitCallback = null;

let initialized = false;

/**
 * Khởi tạo form.
 */
export function initializeMeterReadingForm() {

  if (initialized) {
    return;
  }

  initialized = true;

  modalElement =
    document.createElement("div");

  modalElement.className =
    "modal fade";

  modalElement.tabIndex = -1;

  modalElement.innerHTML =
    createModalHtml();

  document.body.appendChild(
    modalElement
  );

  modalInstance =
    new Modal(modalElement);

  formElement =
    modalElement.querySelector(
      "#meter-reading-form"
    );

  registerEvents();

}

/**
 * Mở form.
 *
 * @param {Object|null} reading
 * @param {Function} onSubmit
 */
export function openMeterReadingForm(
  reading = null,
  onSubmit
) {

  if (!initialized) {
    initializeMeterReadingForm();
  }

  currentReading = reading;

  submitCallback = onSubmit;

  fillForm(reading);

  clearErrors();

  modalInstance.show();

}

/**
 * Đóng form.
 */
export function closeMeterReadingForm() {
  modalInstance.hide();
}

/**
 * HTML modal.
 *
 * @returns {string}
 */
function createModalHtml() {

  return `
<div class="modal-dialog modal-lg">

<div class="modal-content">

<div class="modal-header">

<h5 class="modal-title">

Ghi chỉ số điện nước

</h5>

<button
type="button"
class="btn-close"
data-bs-dismiss="modal">
</button>

</div>

<form
id="meter-reading-form"
novalidate>

<div class="modal-body">

<div class="row g-3">

<div class="col-md-6">

<label class="form-label">

Phòng

</label>

<select
id="room-id"
class="form-select"
data-testid="meter-room">

</select>

<div
id="room-id-error"
class="invalid-feedback">
</div>

</div>

<div class="col-md-6">

<label class="form-label">

Tháng

</label>

<input
type="month"
id="month-key"
class="form-control"
data-testid="meter-month">

<div
id="month-key-error"
class="invalid-feedback">
</div>

</div>

<div class="col-md-6">

<label class="form-label">

Điện tháng trước

</label>

<input
id="electric-old-index"
type="number"
min="0"
class="form-control"
readonly
data-testid="electric-old">

</div>

<div class="col-md-6">

<label class="form-label">

Điện tháng này

</label>

<input
id="electric-new-index"
type="number"
min="0"
class="form-control"
data-testid="electric-new">

<div
id="electric-new-index-error"
class="invalid-feedback">
</div>

</div>

<div class="col-md-6">

<label class="form-label">

Nước tháng trước

</label>

<input
id="water-old-index"
type="number"
min="0"
class="form-control"
readonly
data-testid="water-old">

</div>

<div class="col-md-6">

<label class="form-label">

Nước tháng này

</label>

<input
id="water-new-index"
type="number"
min="0"
class="form-control"
data-testid="water-new">

<div
id="water-new-index-error"
class="invalid-feedback">
</div>

</div>

</div>

<hr>

<div class="row mt-2">

<div class="col-md-6">

<div class="alert alert-info">

<strong>Điện tiêu thụ:</strong>

<span
id="electric-usage">

0

</span>

kWh

</div>

</div>

<div class="col-md-6">

<div class="alert alert-info">

<strong>Nước tiêu thụ:</strong>

<span
id="water-usage">

0

</span>

m³

</div>

</div>

</div>

<div
id="usage-warning"
class="alert alert-warning d-none"
data-testid="usage-warning">

</div>

</div>

<div class="modal-footer">

<button
type="button"
class="btn btn-secondary"
data-bs-dismiss="modal">

Hủy

</button>

<button
type="submit"
class="btn btn-primary"
data-testid="save-meter-reading">

Lưu

</button>

</div>

</form>

</div>

</div>
`;

}

/**
 * Điền dữ liệu lên form.
 *
 * @param {Object|null} reading
 */
function fillForm(reading) {

  formElement.reset();

  formElement.querySelector("#room-id").value =
    reading?.roomId ?? "";

  formElement.querySelector("#month-key").value =
    reading?.monthKey ?? "";

  formElement.querySelector("#electric-old-index").value =
    reading?.electricOldIndex ?? 0;

  formElement.querySelector("#electric-new-index").value =
    reading?.electricNewIndex ?? "";

  formElement.querySelector("#water-old-index").value =
    reading?.waterOldIndex ?? 0;

  formElement.querySelector("#water-new-index").value =
    reading?.waterNewIndex ?? "";

  updateUsagePreview();

}

/**
 * Đọc dữ liệu form.
 *
 * @returns {Object}
 */
function readFormData() {

  return {

    roomId:
      formElement
        .querySelector("#room-id")
        .value
        .trim(),

    monthKey:
      formElement
        .querySelector("#month-key")
        .value,

    electricOldIndex:
      Number(
        formElement.querySelector(
          "#electric-old-index"
        ).value
      ),

    electricNewIndex:
      Number(
        formElement.querySelector(
          "#electric-new-index"
        ).value
      ),

    waterOldIndex:
      Number(
        formElement.querySelector(
          "#water-old-index"
        ).value
      ),

    waterNewIndex:
      Number(
        formElement.querySelector(
          "#water-new-index"
        ).value
      )

  };

}

/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  formElement.addEventListener(
    "submit",
    handleSubmit
  );

  [
    "#electric-new-index",
    "#water-new-index"
  ].forEach((selector) => {

    formElement
      .querySelector(selector)
      .addEventListener(
        "input",
        updateUsagePreview
      );

  });

  formElement
    .querySelectorAll(
      "input, select"
    )
    .forEach((element) => {

      element.addEventListener(
        "input",
        () => clearFieldError(element.id)
      );

    });

}

/**
 * Cập nhật lượng tiêu thụ.
 */
function updateUsagePreview() {

  const electricOld =
    Number(
      formElement.querySelector(
        "#electric-old-index"
      ).value
    );

  const electricNew =
    Number(
      formElement.querySelector(
        "#electric-new-index"
      ).value
    );

  const waterOld =
    Number(
      formElement.querySelector(
        "#water-old-index"
      ).value
    );

  const waterNew =
    Number(
      formElement.querySelector(
        "#water-new-index"
      ).value
    );

  const electricOutput =
    formElement.querySelector(
      "#electric-usage"
    );

  const waterOutput =
    formElement.querySelector(
      "#water-usage"
    );

  try {

    electricOutput.textContent =
      calculateElectricUsage(
        electricOld,
        electricNew
      );

  } catch {

    electricOutput.textContent = "-";

  }

  try {

    waterOutput.textContent =
      calculateWaterUsage(
        waterOld,
        waterNew
      );

  } catch {

    waterOutput.textContent = "-";

  }

}

/**
 * Xóa toàn bộ lỗi.
 */
function clearErrors() {

  formElement
    .querySelectorAll(".is-invalid")
    .forEach((element) =>
      element.classList.remove(
        "is-invalid"
      )
    );

  formElement
    .querySelectorAll(
      ".invalid-feedback"
    )
    .forEach((element) => {
      element.textContent = "";
    });

}

/**
 * Hiển thị lỗi.
 *
 * @param {string} field
 * @param {string} message
 */
function setFieldError(
  field,
  message
) {

  const input =
    formElement.querySelector(
      `#${field}`
    );

  const error =
    formElement.querySelector(
      `#${field}-error`
    );

  if (!input || !error) {
    return;
  }

  input.classList.add(
    "is-invalid"
  );

  error.textContent =
    message;

}

/**
 * Xóa lỗi của một trường.
 *
 * @param {string} field
 */
function clearFieldError(
  field
) {

  const input =
    formElement.querySelector(
      `#${field}`
    );

  const error =
    formElement.querySelector(
      `#${field}-error`
    );

  if (!input || !error) {
    return;
  }

  input.classList.remove(
    "is-invalid"
  );

  error.textContent = "";

}

/**
 * Xử lý submit.
 *
 * @param {SubmitEvent} event
 */
function handleSubmit(event) {

  event.preventDefault();

  clearErrors();

  const data =
    readFormData();

  try {

    submitCallback?.(data);

    closeMeterReadingForm();

  } catch (error) {

    handleValidationError(
      error
    );

  }

}

/**
 * Hiển thị cảnh báo sử dụng.
 *
 * @param {string|null} message
 */
export function showUsageWarning(
  message
) {

  const warning =
    formElement.querySelector(
      "#usage-warning"
    );

  if (!message) {

    warning.classList.add(
      "d-none"
    );

    warning.textContent = "";

    return;

  }

  warning.classList.remove(
    "d-none"
  );

  warning.textContent =
    message;

}

/**
 * Mapping lỗi.
 *
 * @param {Error} error
 */
function handleValidationError(
  error
) {

  const message =
    error.message;

  if (
    message.includes("Phòng")
  ) {

    setFieldError(
      "room-id",
      message
    );

    return;

  }

  if (
    message.includes("Tháng")
  ) {

    setFieldError(
      "month-key",
      message
    );

    return;

  }

  if (
    message.includes("điện")
  ) {

    setFieldError(
      "electric-new-index",
      message
    );

    return;

  }

  if (
    message.includes("nước")
  ) {

    setFieldError(
      "water-new-index",
      message
    );

    return;

  }

  throw error;

}

/**
 * Kiểm tra form đang mở.
 *
 * @returns {boolean}
 */
export function isMeterReadingFormOpen() {

  return (
    modalElement &&
    modalElement.classList.contains(
      "show"
    )
  );

}

/**
 * Lấy dữ liệu hiện tại.
 *
 * @returns {Object}
 */
export function getMeterReadingFormData() {

  if (!formElement) {

    throw new Error(
      "Form chưa được khởi tạo."
    );

  }

  return readFormData();

}

/**
 * Gán dữ liệu.
 *
 * @param {Object} data
 */
export function setMeterReadingFormData(
  data = {}
) {

  if (!formElement) {

    throw new Error(
      "Form chưa được khởi tạo."
    );

  }

  fillForm(data);

}

/**
 * Focus ô đầu tiên.
 */
export function focusFirstField() {

  requestAnimationFrame(() => {

    formElement
      ?.querySelector("#room-id")
      ?.focus();

  });

}

/**
 * Chế độ chỉ đọc.
 *
 * @param {boolean} readonly
 */
export function setFormReadOnly(
  readonly = true
) {

  formElement
    ?.querySelectorAll(
      "input, select"
    )
    .forEach((element) => {

      element.disabled =
        readonly;

    });

  const saveButton =
    formElement.querySelector(
      '[data-testid="save-meter-reading"]'
    );

  if (saveButton) {

    saveButton.hidden =
      readonly;

  }

}

/**
 * Đặt tiêu đề.
 *
 * @param {string} title
 */
export function setFormTitle(
  title
) {

  modalElement
    ?.querySelector(
      ".modal-title"
    )
    .textContent = title;

}

/**
 * Mở form tạo mới.
 *
 * @param {Function} onSubmit
 */
export function openCreateMeterReadingForm(
  onSubmit
) {

  setFormTitle(
    "Thêm chỉ số điện nước"
  );

  setFormReadOnly(false);

  openMeterReadingForm(
    null,
    onSubmit
  );

  focusFirstField();

}

/**
 * Mở form chỉnh sửa.
 *
 * @param {Object} reading
 * @param {Function} onSubmit
 */
export function openEditMeterReadingForm(
  reading,
  onSubmit
) {

  setFormTitle(
    "Cập nhật chỉ số"
  );

  setFormReadOnly(false);

  openMeterReadingForm(
    reading,
    onSubmit
  );

  focusFirstField();

}

/**
 * Mở form xem.
 *
 * @param {Object} reading
 */
export function openViewMeterReadingForm(
  reading
) {

  setFormTitle(
    "Chi tiết chỉ số"
  );

  openMeterReadingForm(
    reading,
    null
  );

  setFormReadOnly(true);

}