/**
 * @file room-form.js
 * @description Form thêm/sửa phòng.
 */

import { ROOM_STATUS_LABELS, ROOM_STATUS } from "../constants/statuses.js";

let modalElement = null;
let modalInstance = null;
let submitCallback = null;
let currentRoomId = null;

/**
 * Khởi tạo form.
 */
export function initializeRoomForm() {
  if (modalElement) {
    return;
  }

  modalElement = document.createElement("div");
  modalElement.className = "modal fade";
  modalElement.tabIndex = -1;

  modalElement.innerHTML = `
<div class="modal-dialog">
<div class="modal-content">

<div class="modal-header">
<h5 class="modal-title" data-testid="room-form-title">
Phòng
</h5>

<button
type="button"
class="btn-close"
data-bs-dismiss="modal">
</button>

</div>

<div class="modal-body">

<form id="room-form" novalidate>

<div class="mb-3">
<label class="form-label">Mã phòng</label>

<input
class="form-control"
id="room-code"
data-testid="room-code">

<div
class="invalid-feedback"
id="room-code-error">
</div>

</div>

<div class="mb-3">
<label class="form-label">Tên phòng</label>

<input
class="form-control"
id="room-name"
data-testid="room-name">

<div
class="invalid-feedback"
id="room-name-error">
</div>

</div>

<div class="mb-3">

<label class="form-label">
Diện tích
</label>

<input
type="number"
class="form-control"
id="room-area"
data-testid="room-area">

<div
class="invalid-feedback"
id="room-area-error">
</div>

</div>

<div class="mb-3">

<label class="form-label">
Giá thuê
</label>

<input
type="number"
class="form-control"
id="room-rent-price"
data-testid="room-rent-price">

<div
class="invalid-feedback"
id="room-rent-error">
</div>

</div>

<div class="mb-3">

<label class="form-label">
Số người tối đa
</label>

<input
type="number"
class="form-control"
id="room-max-occupants"
data-testid="room-max-occupants">

<div
class="invalid-feedback"
id="room-max-error">
</div>

</div>

<div class="mb-3">

<label class="form-label">
Trạng thái
</label>

<select
class="form-select"
id="room-status"
data-testid="room-status">

</select>

</div>

<div class="mb-3">

<label class="form-label">
Ghi chú
</label>

<textarea
class="form-control"
rows="3"
id="room-note"
data-testid="room-note">
</textarea>

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
class="btn btn-primary"
id="room-save-btn"
data-testid="room-save-btn">

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
    .getElementById("room-save-btn")
    .addEventListener("click", handleSubmit);
}

/**
 * Đổ danh sách trạng thái.
 */
function populateStatuses() {
  const select = document.getElementById("room-status");

  select.innerHTML = "";

  Object.values(ROOM_STATUS).forEach((status) => {
    const option = document.createElement("option");

    option.value = status;
    option.textContent = ROOM_STATUS_LABELS[status];

    select.appendChild(option);
  });
}

/**
 * Hiển thị form.
 *
 * @param {Object|null} room
 * @param {Function} callback
 */
export function openRoomForm(room = null, callback) {
  submitCallback = callback;

  clearErrors();

  currentRoomId = room?.id ?? null;

  document.getElementById("room-code").value =
    room?.code ?? "";

  document.getElementById("room-name").value =
    room?.name ?? "";

  document.getElementById("room-area").value =
    room?.area ?? "";

  document.getElementById("room-rent-price").value =
    room?.rentPrice ?? "";

  document.getElementById("room-max-occupants").value =
    room?.maxOccupants ?? "";

  document.getElementById("room-status").value =
    room?.status ?? ROOM_STATUS.AVAILABLE;

  document.getElementById("room-note").value =
    room?.note ?? "";

  document.querySelector(
    "[data-testid='room-form-title']"
  ).textContent = room
    ? "Cập nhật phòng"
    : "Thêm phòng";

  modalInstance.show();
}

/**
 * Đóng form.
 */
export function closeRoomForm() {
  modalInstance.hide();
}

/**
 * Submit.
 */
function handleSubmit() {
  clearErrors();

  const data = {
    id: currentRoomId,
    code: document.getElementById("room-code").value,
    name: document.getElementById("room-name").value,
    area: Number(
      document.getElementById("room-area").value
    ),
    rentPrice: Number(
      document.getElementById("room-rent-price").value
    ),
    maxOccupants: Number(
      document.getElementById("room-max-occupants").value
    ),
    status:
      document.getElementById("room-status").value,
    note: document.getElementById("room-note").value
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
export function setFieldError(field, message) {
  const input = document.getElementById(field);

  const error = document.getElementById(
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
    .forEach((element) =>
      element.classList.remove("is-invalid")
    );

  modalElement
    ?.querySelectorAll(".invalid-feedback")
    .forEach((element) => {
      element.textContent = "";
    });
}