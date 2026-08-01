/**
 * @file tenant-form.js
 * @description Form thêm/sửa người thuê.
 */

import {
  TENANT_STATUS,
  TENANT_STATUS_LABELS
} from "../constants/statuses.js";

let modalElement = null;
let modalInstance = null;

let submitCallback = null;
let currentTenantId = null;

/**
 * Khởi tạo form.
 */
export function initializeTenantForm() {
  if (modalElement) {
    return;
  }

  modalElement = document.createElement("div");
  modalElement.className = "modal fade";
  modalElement.tabIndex = -1;

  modalElement.innerHTML = `
<div class="modal-dialog modal-lg">

<div class="modal-content">

<div class="modal-header">

<h5
class="modal-title"
data-testid="tenant-form-title">

Người thuê

</h5>

<button
type="button"
class="btn-close"
data-bs-dismiss="modal">
</button>

</div>

<div class="modal-body">

<form
id="tenant-form"
novalidate>

<div class="row">

<div class="col-md-6 mb-3">

<label class="form-label">

Họ và tên

</label>

<input
id="tenant-full-name"
class="form-control"
data-testid="tenant-full-name">

<div
id="tenant-full-name-error"
class="invalid-feedback">
</div>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">

Số điện thoại

</label>

<input
id="tenant-phone-number"
class="form-control"
data-testid="tenant-phone-number">

<div
id="tenant-phone-number-error"
class="invalid-feedback">
</div>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">

CCCD

</label>

<input
id="tenant-identity-number"
class="form-control"
data-testid="tenant-identity-number">

<div
id="tenant-identity-number-error"
class="invalid-feedback">
</div>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">

Email

</label>

<input
type="email"
id="tenant-email"
class="form-control"
data-testid="tenant-email">

<div
id="tenant-email-error"
class="invalid-feedback">
</div>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">

Trạng thái

</label>

<select
id="tenant-status"
class="form-select"
data-testid="tenant-status">

</select>

</div>

<div class="col-md-6 mb-3">

<label class="form-label">

Ghi chú

</label>

<input
id="tenant-note"
class="form-control"
data-testid="tenant-note">

</div>

</div>

</form>

</div>

<div class="modal-footer">

<button
type="button"
class="btn btn-secondary"
data-bs-dismiss="modal">

Hủy

</button>

<button
type="button"
id="tenant-save-btn"
class="btn btn-primary"
data-testid="tenant-save-btn">

Lưu

</button>

</div>

</div>

</div>
`;

  document.body.appendChild(modalElement);

  modalInstance = new bootstrap.Modal(modalElement);

  populateStatuses();

  document
    .getElementById("tenant-save-btn")
    .addEventListener("click", handleSubmit);
}

/**
 * Đổ trạng thái.
 */
function populateStatuses() {

  const select =
    document.getElementById(
      "tenant-status"
    );

  select.innerHTML = "";

  Object.values(TENANT_STATUS).forEach(
    (status) => {

      const option =
        document.createElement("option");

      option.value = status;

      option.textContent =
        TENANT_STATUS_LABELS[status];

      select.appendChild(option);

    }
  );

}

/**
 * Mở form.
 *
 * @param {Object|null} tenant
 * @param {Function} callback
 */
export function openTenantForm(
  tenant = null,
  callback
) {

  submitCallback = callback;

  currentTenantId =
    tenant?.id ?? null;

  clearErrors();

  document.getElementById(
    "tenant-full-name"
  ).value =
    tenant?.fullName ?? "";

  document.getElementById(
    "tenant-phone-number"
  ).value =
    tenant?.phoneNumber ?? "";

  document.getElementById(
    "tenant-identity-number"
  ).value =
    tenant?.identityNumber ?? "";

  document.getElementById(
    "tenant-email"
  ).value =
    tenant?.email ?? "";

  document.getElementById(
    "tenant-status"
  ).value =
    tenant?.status ??
    TENANT_STATUS.ACTIVE;

  document.getElementById(
    "tenant-note"
  ).value =
    tenant?.note ?? "";

  document.querySelector(
    "[data-testid='tenant-form-title']"
  ).textContent =
    tenant
      ? "Cập nhật người thuê"
      : "Thêm người thuê";

  modalInstance.show();

}

/**
 * Đóng form.
 */
export function closeTenantForm() {
  modalInstance.hide();
}

/**
 * Submit.
 */
function handleSubmit() {

  const data = {

    id: currentTenantId,

    fullName:
      document.getElementById(
        "tenant-full-name"
      ).value,

    phoneNumber:
      document.getElementById(
        "tenant-phone-number"
      ).value,

    identityNumber:
      document.getElementById(
        "tenant-identity-number"
      ).value,

    email:
      document.getElementById(
        "tenant-email"
      ).value,

    status:
      document.getElementById(
        "tenant-status"
      ).value,

    note:
      document.getElementById(
        "tenant-note"
      ).value

  };

  if (submitCallback) {
    submitCallback(data);
  }

}

/**
 * Hiển thị lỗi.
 *
 * @param {string} field
 * @param {string} message
 */
export function setFieldError(
  field,
  message
) {

  const input =
    document.getElementById(field);

  const error =
    document.getElementById(
      `${field}-error`
    );

  if (!input || !error) {
    return;
  }

  input.classList.add("is-invalid");

  error.textContent = message;

}

/**
 * Xóa lỗi.
 */
export function clearErrors() {

  modalElement
    ?.querySelectorAll(".is-invalid")
    .forEach((element) => {

      element.classList.remove(
        "is-invalid"
      );

    });

  modalElement
    ?.querySelectorAll(
      ".invalid-feedback"
    )
    .forEach((element) => {

      element.textContent = "";

    });

}