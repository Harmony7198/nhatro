/**
 * @file contract-form.js
 * @description Modal thêm/sửa/gia hạn hợp đồng.
 */

import { Modal } from "bootstrap";

import { getAvailableRooms } from "../services/room-service.js";
import { getTenants } from "../services/tenant-service.js";

let modalElement = null;
let modalInstance = null;
let formElement = null;

let submitCallback = null;
let currentContract = null;

/**
 * Khởi tạo modal.
 */
export function initializeContractForm() {
  if (modalElement) {
    return;
  }

  modalElement = document.createElement("div");

  modalElement.className = "modal fade";

  modalElement.tabIndex = -1;

  modalElement.innerHTML = `
<div class="modal-dialog modal-xl">
  <div class="modal-content">

    <div class="modal-header">
      <h5
        class="modal-title"
        data-testid="contract-form-title">
        Hợp đồng
      </h5>

      <button
        class="btn-close"
        data-bs-dismiss="modal">
      </button>
    </div>

    <div class="modal-body">

      <form
        id="contract-form"
        novalidate>

        <div class="row g-3">

          <div class="col-md-6">

            <label class="form-label">
              Phòng
            </label>

            <select
              id="contract-room"
              class="form-select"
              data-testid="contract-room">

            </select>

            <div
              id="contract-room-error"
              class="invalid-feedback">
            </div>

          </div>

          <div class="col-md-6">

            <label class="form-label">
              Người đại diện
            </label>

            <select
              id="contract-representative"
              class="form-select"
              data-testid="contract-representative">

            </select>

            <div
              id="contract-representative-error"
              class="invalid-feedback">
            </div>

          </div>

          <div class="col-12">

            <label class="form-label">
              Người ở cùng
            </label>

            <select
              multiple
              size="6"
              id="contract-tenants"
              class="form-select"
              data-testid="contract-tenants">

            </select>

            <div
              id="contract-tenants-error"
              class="invalid-feedback">
            </div>

          </div>

          <div class="col-md-6">

            <label class="form-label">
              Ngày bắt đầu
            </label>

            <input
              type="date"
              id="contract-start-date"
              class="form-control"
              data-testid="contract-start-date">

            <div
              id="contract-start-date-error"
              class="invalid-feedback">
            </div>

          </div>

          <div class="col-md-6">

            <label class="form-label">
              Ngày kết thúc
            </label>

            <input
              type="date"
              id="contract-end-date"
              class="form-control"
              data-testid="contract-end-date">

            <div
              id="contract-end-date-error"
              class="invalid-feedback">
            </div>

          </div>

          <div class="col-md-6">

            <label class="form-label">
              Giá thuê
            </label>

            <input
              type="number"
              min="0"
              id="contract-rent-price"
              class="form-control"
              data-testid="contract-rent-price">

            <div
              id="contract-rent-price-error"
              class="invalid-feedback">
            </div>

          </div>

          <div class="col-md-6">

            <label class="form-label">
              Tiền cọc
            </label>

            <input
              type="number"
              min="0"
              id="contract-deposit"
              class="form-control"
              data-testid="contract-deposit">

            <div
              id="contract-deposit-error"
              class="invalid-feedback">
            </div>

          </div>

          <div class="col-12">

            <label class="form-label">
              Ghi chú
            </label>

            <textarea
              rows="3"
              id="contract-notes"
              class="form-control"
              data-testid="contract-notes">
            </textarea>

          </div>

        </div>

      </form>

    </div>

    <div class="modal-footer">

      <button
        class="btn btn-secondary"
        data-bs-dismiss="modal">
        Hủy
      </button>

      <button
        id="contract-save-button"
        class="btn btn-primary"
        data-testid="contract-save">
        Lưu
      </button>

    </div>

  </div>
</div>
`;

  document.body.appendChild(
    modalElement
  );

  modalInstance =
    new Modal(modalElement);

  formElement =
    modalElement.querySelector(
      "#contract-form"
    );

  registerEvents();
}
/**
 * Mở form hợp đồng.
 *
 * @param {Object|null} contract
 * @param {Function} onSubmit
 */
export function openContractForm(
  contract = null,
  onSubmit
) {
  if (!modalInstance) {
    initializeContractForm();
  }

  currentContract = contract;
  submitCallback = onSubmit;

  clearErrors();

  loadRooms();
  loadTenants();

  fillForm(contract);

  const title =
    modalElement.querySelector(
      '[data-testid="contract-form-title"]'
    );

  title.textContent = contract
    ? "Cập nhật hợp đồng"
    : "Thêm hợp đồng";

  modalInstance.show();
}

/**
 * Đóng form.
 */
export function closeContractForm() {
  modalInstance?.hide();

  currentContract = null;
  submitCallback = null;

  formElement?.reset();

  clearErrors();
}

/**
 * Nạp danh sách phòng.
 */
function loadRooms() {
  const select =
    modalElement.querySelector(
      "#contract-room"
    );

  select.innerHTML = "";

  const rooms =
    getAvailableRooms();

  if (
    currentContract &&
    currentContract.roomId
  ) {
    const exists = rooms.some(
      (room) =>
        room.id === currentContract.roomId
    );

    if (!exists) {
      // Cho phép sửa hợp đồng hiện có
      rooms.push({
        id: currentContract.roomId,
        code: currentContract.roomCode,
        name: currentContract.roomName,
        rentPrice:
          currentContract.rentPrice
      });
    }
  }

  select.insertAdjacentHTML(
    "beforeend",
    `
<option value="">
Chọn phòng
</option>
`
  );

  rooms.forEach((room) => {
    select.insertAdjacentHTML(
      "beforeend",
      `
<option value="${room.id}">
${room.code} - ${room.name}
</option>
`
    );
  });
}

/**
 * Nạp danh sách người thuê.
 */
function loadTenants() {
  const representative =
    modalElement.querySelector(
      "#contract-representative"
    );

  const tenantsSelect =
    modalElement.querySelector(
      "#contract-tenants"
    );

  representative.innerHTML = "";
  tenantsSelect.innerHTML = "";

  const tenants =
    getTenants();

  representative.insertAdjacentHTML(
    "beforeend",
    `
<option value="">
Chọn người đại diện
</option>
`
  );

  tenants.forEach((tenant) => {

    representative.insertAdjacentHTML(
      "beforeend",
      `
<option value="${tenant.id}">
${tenant.fullName}
</option>
`
    );

    tenantsSelect.insertAdjacentHTML(
      "beforeend",
      `
<option value="${tenant.id}">
${tenant.fullName}
</option>
`
    );

  });
}

/**
 * Điền dữ liệu.
 *
 * @param {Object|null} contract
 */
function fillForm(contract) {

  formElement.reset();

  if (!contract) {
    return;
  }

  modalElement.querySelector(
    "#contract-room"
  ).value =
    contract.roomId ?? "";

  modalElement.querySelector(
    "#contract-representative"
  ).value =
    contract.tenantId ?? "";

  modalElement.querySelector(
    "#contract-start-date"
  ).value =
    (contract.startDate ?? "")
      .substring(0, 10);

  modalElement.querySelector(
    "#contract-end-date"
  ).value =
    (contract.endDate ?? "")
      .substring(0, 10);

  modalElement.querySelector(
    "#contract-rent-price"
  ).value =
    contract.rentPrice ?? "";

  modalElement.querySelector(
    "#contract-deposit"
  ).value =
    contract.deposit ?? "";

  modalElement.querySelector(
    "#contract-notes"
  ).value =
    contract.notes ?? "";

  const selected =
    contract.tenantIds ?? [];

  const options =
    modalElement.querySelector(
      "#contract-tenants"
    ).options;

  [...options].forEach((option) => {

    option.selected =
      selected.includes(option.value);

  });

}

/**
 * Đọc dữ liệu form.
 *
 * @returns {Object}
 */
function readFormData() {

  const selectedTenants =
    [
      ...modalElement.querySelector(
        "#contract-tenants"
      ).selectedOptions
    ].map(
      (option) => option.value
    );

  return {

    roomId:
      modalElement.querySelector(
        "#contract-room"
      ).value,

    tenantId:
      modalElement.querySelector(
        "#contract-representative"
      ).value,

    tenantIds:
      selectedTenants,

    startDate:
      modalElement.querySelector(
        "#contract-start-date"
      ).value,

    endDate:
      modalElement.querySelector(
        "#contract-end-date"
      ).value,

    rentPrice:
      Number(
        modalElement.querySelector(
          "#contract-rent-price"
        ).value
      ),

    deposit:
      Number(
        modalElement.querySelector(
          "#contract-deposit"
        ).value
      ),

    notes:
      modalElement.querySelector(
        "#contract-notes"
      ).value.trim()

  };

}

/**
 * Xóa toàn bộ lỗi.
 */
export function clearErrors() {

  modalElement
    ?.querySelectorAll(
      ".invalid-feedback"
    )
    .forEach((element) => {

      element.textContent = "";

    });

  modalElement
    ?.querySelectorAll(
      ".is-invalid"
    )
    .forEach((element) => {

      element.classList.remove(
        "is-invalid"
      );

    });

}

/**
 * Hiển thị lỗi.
 *
 * @param {string} fieldId
 * @param {string} message
 */
export function setFieldError(
  fieldId,
  message
) {

  const input =
    modalElement.querySelector(
      `#${fieldId}`
    );

  if (input) {

    input.classList.add(
      "is-invalid"
    );

  }

  const error =
    modalElement.querySelector(
      `#${fieldId}-error`
    );

  if (error) {

    error.textContent =
      message;

  }

}
/**
 * Đăng ký sự kiện.
 */
function registerEvents() {
  const saveButton = modalElement.querySelector(
    "#contract-save-button"
  );

  saveButton.addEventListener(
    "click",
    handleSubmit
  );

  modalElement
    .querySelector("#contract-room")
    .addEventListener(
      "change",
      handleRoomChanged
    );

  modalElement
    .querySelector("#contract-tenants")
    .addEventListener(
      "change",
      validateOccupancy
    );

  modalElement.addEventListener(
    "hidden.bs.modal",
    () => {
      formElement.reset();
      clearErrors();

      currentContract = null;
      submitCallback = null;
    }
  );
}

/**
 * Khi đổi phòng.
 */
function handleRoomChanged(event) {
  clearFieldError("contract-room");

  const roomId = event.target.value;

  if (!roomId) {
    return;
  }

  const rooms = getAvailableRooms();

  const room = rooms.find(
    (item) => item.id === roomId
  );

  if (!room) {
    return;
  }

  const rentInput =
    modalElement.querySelector(
      "#contract-rent-price"
    );

  if (
    !currentContract ||
    currentContract.roomId !== roomId
  ) {
    rentInput.value =
      room.rentPrice ?? 0;
  }

  validateOccupancy();
}

/**
 * Kiểm tra số người.
 */
function validateOccupancy() {
  clearFieldError(
    "contract-tenants"
  );

  const roomId =
    modalElement.querySelector(
      "#contract-room"
    ).value;

  if (!roomId) {
    return true;
  }

  const room =
    getAvailableRooms().find(
      (item) =>
        item.id === roomId
    );

  if (!room) {
    return true;
  }

  const selected =
    [
      ...modalElement.querySelector(
        "#contract-tenants"
      ).selectedOptions
    ];

  if (
    selected.length >
    room.maxOccupancy
  ) {
    setFieldError(
      "contract-tenants",
      `Số người vượt quá sức chứa (${room.maxOccupancy}).`
    );

    return false;
  }

  return true;
}

/**
 * Lưu hợp đồng.
 *
 * @param {Event} event
 */
function handleSubmit(event) {
  event.preventDefault();

  clearErrors();

  if (!validateOccupancy()) {
    return;
  }

  const data = readFormData();

  try {
    submitCallback?.(data);
  } catch (error) {
    mapServiceError(error);
  }
}

/**
 * Chuyển lỗi nghiệp vụ thành lỗi giao diện.
 *
 * @param {Error} error
 */
function mapServiceError(error) {
  const message =
    error?.message ?? "";

  if (
    message.includes("Phòng")
  ) {
    setFieldError(
      "contract-room",
      message
    );
    return;
  }

  if (
    message.includes("Người đại diện")
  ) {
    setFieldError(
      "contract-representative",
      message
    );
    return;
  }

  if (
    message.includes("Ngày bắt đầu")
  ) {
    setFieldError(
      "contract-start-date",
      message
    );
    return;
  }

  if (
    message.includes("Ngày kết thúc")
  ) {
    setFieldError(
      "contract-end-date",
      message
    );
    return;
  }

  if (
    message.includes("Giá thuê")
  ) {
    setFieldError(
      "contract-rent-price",
      message
    );
    return;
  }

  if (
    message.includes("Tiền cọc")
  ) {
    setFieldError(
      "contract-deposit",
      message
    );
    return;
  }

  if (
    message.includes("trùng thời gian")
  ) {
    setFieldError(
      "contract-room",
      message
    );
    return;
  }

  if (
    message.includes("sức chứa")
  ) {
    setFieldError(
      "contract-tenants",
      message
    );
    return;
  }

  throw error;
}

/**
 * Xóa lỗi của một trường.
 *
 * @param {string} fieldId
 */
function clearFieldError(fieldId) {
  const input =
    modalElement.querySelector(
      `#${fieldId}`
    );

  input?.classList.remove(
    "is-invalid"
  );

  const error =
    modalElement.querySelector(
      `#${fieldId}-error`
    );

  if (error) {
    error.textContent = "";
  }
}

/**
 * Kiểm tra modal đã mở chưa.
 *
 * @returns {boolean}
 */
export function isContractFormOpen() {
  return modalElement?.classList.contains(
    "show"
  );
}

/**
 * Lấy dữ liệu hiện tại trên form.
 *
 * Hữu ích cho Playwright hoặc debug.
 *
 * @returns {Object}
 */
export function getContractFormData() {
  return readFormData();
}