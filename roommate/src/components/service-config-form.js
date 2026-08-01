/**
 * @file service-config-form.js
 * @description Form thêm/sửa cấu hình dịch vụ.
 */

import { Modal } from "bootstrap";

import {
  SERVICE_CALCULATION_TYPES
} from "../business/service-config-validator.js";

let modalElement = null;
let modalInstance = null;
let formElement = null;

let currentService = null;
let submitCallback = null;

let initialized = false;

/**
 * Khởi tạo form.
 */
export function initializeServiceConfigForm() {

  if (initialized) {
    return;
  }

  initialized = true;

  modalElement =
    document.createElement("div");

  modalElement.className =
    "modal fade";

  modalElement.tabIndex = -1;

  modalElement.innerHTML = createModalHtml();

  document.body.appendChild(
    modalElement
  );

  modalInstance =
    new Modal(modalElement);

  formElement =
    modalElement.querySelector(
      "#service-config-form"
    );

  registerEvents();

}

/**
 * Mở form.
 *
 * @param {Object|null} service
 * @param {Function} onSubmit
 */
export function openServiceConfigForm(
  service = null,
  onSubmit
) {

  if (!initialized) {
    initializeServiceConfigForm();
  }

  currentService = service;

  submitCallback = onSubmit;

  fillForm(service);

  clearErrors();

  modalInstance.show();

}

/**
 * Đóng form.
 */
export function closeServiceConfigForm() {

  modalInstance.hide();

}
/** html của modal */
function createModalHtml() {

  return `
<div class="modal-dialog">

<div class="modal-content">

<div class="modal-header">

<h5 class="modal-title">

Cấu hình dịch vụ

</h5>

<button
class="btn-close"
data-bs-dismiss="modal">
</button>

</div>

<form
id="service-config-form"
novalidate>

<div class="modal-body">

<div class="mb-3">

<label class="form-label">

Mã dịch vụ

</label>

<input
id="service-code"
class="form-control"
data-testid="service-code">

<div
id="service-code-error"
class="invalid-feedback">
</div>

</div>

<div class="mb-3">

<label class="form-label">

Tên dịch vụ

</label>

<input
id="service-name"
class="form-control"
data-testid="service-name">

<div
id="service-name-error"
class="invalid-feedback">
</div>

</div>

<div class="mb-3">

<label class="form-label">

Đơn giá

</label>

<input
type="number"
min="0"
id="service-unit-price"
class="form-control"
data-testid="service-unit-price">

<div
id="service-unit-price-error"
class="invalid-feedback">
</div>

</div>

<div class="mb-3">

<label class="form-label">

Cách tính

</label>

<select
id="service-calculation-type"
class="form-select"
data-testid="service-calculation-type">

<option value="${SERVICE_CALCULATION_TYPES.USAGE}">
Theo lượng sử dụng
</option>

<option value="${SERVICE_CALCULATION_TYPES.FIXED}">
Cố định theo phòng
</option>

<option value="${SERVICE_CALCULATION_TYPES.PER_PERSON}">
Theo số người
</option>

<option value="${SERVICE_CALCULATION_TYPES.PER_VEHICLE}">
Theo số xe
</option>

<option value="${SERVICE_CALCULATION_TYPES.MANUAL}">
Nhập thủ công
</option>

</select>

<div
id="service-calculation-type-error"
class="invalid-feedback">
</div>

</div>

<div class="form-check">

<input
type="checkbox"
id="service-active"
class="form-check-input"
checked
data-testid="service-active">

<label
class="form-check-label"
for="service-active">

Đang áp dụng

</label>

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
data-testid="save-service">

Lưu

</button>

</div>

</form>

</div>

</div>
`;

}


/**
 * Đổ dữ liệu lên form.
 *
 * @param {Object|null} service
 */
function fillForm(service) {

  formElement.reset();

  if (!service) {
    return;
  }

  formElement.querySelector(
    "#service-code"
  ).value = service.code ?? "";

  formElement.querySelector(
    "#service-name"
  ).value = service.name ?? "";

  formElement.querySelector(
    "#service-unit-price"
  ).value = service.unitPrice ?? 0;

  formElement.querySelector(
    "#service-calculation-type"
  ).value =
    service.calculationType;

  formElement.querySelector(
    "#service-active"
  ).checked =
    service.active ?? true;

}

/**
 * Đọc dữ liệu từ form.
 *
 * @returns {Object}
 */
function readFormData() {

  return {

    code:
      formElement.querySelector(
        "#service-code"
      ).value,

    name:
      formElement.querySelector(
        "#service-name"
      ).value,

    unitPrice:
      Number(
        formElement.querySelector(
          "#service-unit-price"
        ).value
      ),

    calculationType:
      formElement.querySelector(
        "#service-calculation-type"
      ).value,

    active:
      formElement.querySelector(
        "#service-active"
      ).checked

  };

}

/**
 * Xóa toàn bộ lỗi.
 */
function clearErrors() {

  formElement
    .querySelectorAll(".is-invalid")
    .forEach((input) =>
      input.classList.remove(
        "is-invalid"
      )
    );

  formElement
    .querySelectorAll(
      ".invalid-feedback"
    )
    .forEach((item) => {

      item.textContent = "";

    });

}

/**
 * Hiển thị lỗi.
 *
 * @param {string} fieldId
 * @param {string} message
 */
function setFieldError(
  fieldId,
  message
) {

  const input =
    formElement.querySelector(
      `#${fieldId}`
    );

  input?.classList.add(
    "is-invalid"
  );

  const error =
    formElement.querySelector(
      `#${fieldId}-error`
    );

  if (error) {

    error.textContent =
      message;

  }

}

/**
 * Xóa lỗi của một trường.
 *
 * @param {string} fieldId
 */
function clearFieldError(
  fieldId
) {

  const input =
    formElement.querySelector(
      `#${fieldId}`
    );

  input?.classList.remove(
    "is-invalid"
  );

  const error =
    formElement.querySelector(
      `#${fieldId}-error`
    );

  if (error) {

    error.textContent = "";

  }

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
    "service-code",
    "service-name",
    "service-unit-price",
    "service-calculation-type"
  ].forEach((id) => {

    formElement
      .querySelector(`#${id}`)
      .addEventListener(
        "input",
        () => clearFieldError(id)
      );

  });

  modalElement.addEventListener(
    "hidden.bs.modal",
    () => {

      formElement.reset();

      clearErrors();

      currentService = null;

      submitCallback = null;

    }
  );

}


/**
 * Submit form.
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

    closeServiceConfigForm();

  } catch (error) {

    mapServiceError(error);

  }

}



/**
 * Chuyển lỗi nghiệp vụ
 * thành lỗi giao diện.
 *
 * @param {Error} error
 */
function mapServiceError(
  error
) {

  const message =
    error?.message ?? "";

  if (
    message.includes(
      "Mã dịch vụ"
    )
  ) {

    setFieldError(
      "service-code",
      message
    );

    return;

  }

  if (
    message.includes("Tên")
  ) {

    setFieldError(
      "service-name",
      message
    );

    return;

  }

  if (
    message.includes(
      "Đơn giá"
    )
  ) {

    setFieldError(
      "service-unit-price",
      message
    );

    return;

  }

  if (
    message.includes(
      "Cách tính"
    )
  ) {

    setFieldError(
      "service-calculation-type",
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
export function isServiceConfigFormOpen() {
  return (
    modalElement !== null &&
    modalElement.classList.contains("show")
  );
}

/**
 * Lấy dữ liệu hiện tại trên form.
 *
 * Hữu ích cho Playwright hoặc debug.
 *
 * @returns {Object}
 */
export function getServiceConfigFormData() {
  if (!formElement) {
    throw new Error(
      "Form chưa được khởi tạo."
    );
  }

  return readFormData();
}

/**
 * Gán dữ liệu cho form.
 *
 * Dùng cho test hoặc khi cần
 * cập nhật form mà không mở lại modal.
 *
 * @param {Object} data
 */
export function setServiceConfigFormData(
  data = {}
) {
  if (!formElement) {
    throw new Error(
      "Form chưa được khởi tạo."
    );
  }

  formElement.querySelector(
    "#service-code"
  ).value = data.code ?? "";

  formElement.querySelector(
    "#service-name"
  ).value = data.name ?? "";

  formElement.querySelector(
    "#service-unit-price"
  ).value =
    data.unitPrice ?? "";

  formElement.querySelector(
    "#service-calculation-type"
  ).value =
    data.calculationType ??
    SERVICE_CALCULATION_TYPES.FIXED;

  formElement.querySelector(
    "#service-active"
  ).checked =
    data.active ?? true;
}

/**
 * Focus ô đầu tiên.
 */
export function focusFirstField() {
  if (!formElement) {
    return;
  }

  requestAnimationFrame(() => {
    formElement
      .querySelector("#service-code")
      ?.focus();
  });
}

/**
 * Đặt trạng thái chỉ đọc.
 *
 * @param {boolean} readonly
 */
export function setFormReadOnly(
  readonly = true
) {
  if (!formElement) {
    return;
  }

  formElement
    .querySelectorAll(
      "input, select, textarea"
    )
    .forEach((element) => {
      element.disabled = readonly;
    });

  const saveButton =
    formElement.querySelector(
      '[data-testid="save-service"]'
    );

  if (saveButton) {
    saveButton.hidden = readonly;
  }
}

/**
 * Đặt tiêu đề modal.
 *
 * @param {string} title
 */
export function setFormTitle(title) {
  if (!modalElement) {
    return;
  }

  const titleElement =
    modalElement.querySelector(
      ".modal-title"
    );

  if (titleElement) {
    titleElement.textContent =
      title;
  }
}

/**
 * Mở form ở chế độ tạo mới.
 *
 * @param {Function} onSubmit
 */
export function openCreateServiceForm(
  onSubmit
) {
  setFormTitle(
    "Thêm dịch vụ"
  );

  setFormReadOnly(false);

  openServiceConfigForm(
    null,
    onSubmit
  );

  focusFirstField();
}

/**
 * Mở form ở chế độ chỉnh sửa.
 *
 * @param {Object} service
 * @param {Function} onSubmit
 */
export function openEditServiceForm(
  service,
  onSubmit
) {
  setFormTitle(
    "Cập nhật dịch vụ"
  );

  setFormReadOnly(false);

  openServiceConfigForm(
    service,
    onSubmit
  );

  focusFirstField();
}

/**
 * Mở form ở chế độ chỉ xem.
 *
 * @param {Object} service
 */
export function openViewServiceForm(
  service
) {
  setFormTitle(
    "Chi tiết dịch vụ"
  );

  openServiceConfigForm(
    service,
    null
  );

  setFormReadOnly(true);
}

