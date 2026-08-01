/**
 * @file rooms-page.js
 * @description Trang quản lý phòng.
 */

import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  searchRooms,
  filterRooms
} from "../services/room-service.js";

import {
  ROOM_STATUS,
  ROOM_STATUS_LABELS
} from "../constants/statuses.js";

import {
  openRoomForm,
  initializeRoomForm,
  closeRoomForm,
  setFieldError,
  clearErrors
} from "../components/room-form.js";

import {
  showToast
} from "../components/toast.js";

import {
  showConfirmDialog
} from "../components/confirm-dialog.js";

import {
  formatCurrency
} from "../utils/currency-utils.js";

let pageElement = null;
let tableContainer = null;

let keyword = "";
let statusFilter = "";
let sortPrice = "asc";

/**
 * Render trang quản lý phòng.
 *
 * @returns {HTMLElement}
 */
export function renderRoomsPage() {
  initializeRoomForm();

  pageElement = document.createElement("div");
  pageElement.className = "rooms-page";

  pageElement.innerHTML = `
<div class="container-fluid">

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

        <div>

            <h2 class="mb-1">
                Quản lý phòng
            </h2>

            <p class="text-muted mb-0">
                Quản lý thông tin phòng của nhà trọ.
            </p>

        </div>

        <button
            class="btn btn-primary"
            id="btn-add-room"
            data-testid="btn-add-room">

            <i class="bi bi-plus-lg"></i>
            Thêm phòng

        </button>

    </div>

    <div class="card shadow-sm mb-4">

        <div class="card-body">

            <div class="row g-3">

                <div class="col-lg-5">

                    <input
                        id="room-search"
                        data-testid="room-search"
                        class="form-control"
                        placeholder="Tìm theo mã hoặc tên phòng">

                </div>

                <div class="col-lg-3">

                    <select
                        id="room-status-filter"
                        data-testid="room-status-filter"
                        class="form-select">

                        <option value="">
                            Tất cả trạng thái
                        </option>

                    </select>

                </div>

                <div class="col-lg-2">

                    <select
                        id="room-price-sort"
                        data-testid="room-price-sort"
                        class="form-select">

                        <option value="asc">
                            Giá tăng dần
                        </option>

                        <option value="desc">
                            Giá giảm dần
                        </option>

                    </select>

                </div>

            </div>

        </div>

    </div>

    <div
        id="rooms-table-container"
        data-testid="rooms-table-container">
    </div>

</div>
`;

  tableContainer =
    pageElement.querySelector(
      "#rooms-table-container"
    );

  populateStatusFilter();

  registerEvents();

  renderRoomsTable();

  return pageElement;
}

/**
 * Đổ danh sách trạng thái.
 */
function populateStatusFilter() {

  const select =
    pageElement.querySelector(
      "#room-status-filter"
    );

  Object.values(ROOM_STATUS).forEach((status) => {

    const option =
      document.createElement("option");

    option.value = status;
    option.textContent =
      ROOM_STATUS_LABELS[status];

    select.appendChild(option);

  });

}

/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  pageElement
    .querySelector("#room-search")
    .addEventListener("input", (event) => {

      keyword = event.target.value.trim();

      renderRoomsTable();

    });

  pageElement
    .querySelector("#room-status-filter")
    .addEventListener("change", (event) => {

      statusFilter = event.target.value;

      renderRoomsTable();

    });

  pageElement
    .querySelector("#room-price-sort")
    .addEventListener("change", (event) => {

      sortPrice = event.target.value;

      renderRoomsTable();

    });

  pageElement
    .querySelector("#btn-add-room")
    .addEventListener("click", handleAddRoom);

  tableContainer.addEventListener(
    "click",
    handleTableClick
  );

}

/**
 * Render bảng.
 */
function renderRoomsTable() {

  let rooms =
    keyword
      ? searchRooms(keyword)
      : getRooms();

  rooms = filterRooms({
    rooms,
    status: statusFilter,
    sortPrice
  });

  if (rooms.length === 0) {

    tableContainer.innerHTML = `
<div class="card">

    <div
        class="card-body
               text-center
               py-5"
        data-testid="empty-state">

        <h5>
            Không có phòng
        </h5>

        <p class="text-muted mb-0">
            Không tìm thấy dữ liệu phù hợp.
        </p>

    </div>

</div>
`;

    return;

  }

  tableContainer.innerHTML = `
<div class="table-responsive">

<table
class="table table-hover align-middle"
data-testid="rooms-table">

<thead>

<tr>

<th>Mã</th>

<th>Tên phòng</th>

<th>Diện tích</th>

<th>Giá thuê</th>

<th>Tối đa</th>

<th>Trạng thái</th>

<th width="230">
Thao tác
</th>

</tr>

</thead>

<tbody>

${rooms.map(renderRoomRow).join("")}

</tbody>

</table>

</div>
`;

}

/**
 * Render một dòng.
 *
 * @param {Object} room
 * @returns {string}
 */
function renderRoomRow(room) {

  return `
<tr>

<td>${room.code}</td>

<td>${room.name}</td>

<td>${room.area} m²</td>

<td>${formatCurrency(room.rentPrice)}</td>

<td>${room.maxOccupants}</td>

<td>
${renderStatusBadge(room.status)}
</td>

<td>

<button
class="btn btn-sm btn-outline-info room-detail-btn"
data-room-id="${room.id}"
data-testid="btn-room-detail">

Chi tiết

</button>

<button
class="btn btn-sm btn-outline-primary room-edit-btn"
data-room-id="${room.id}"
data-testid="btn-room-edit">

Sửa

</button>

<button
class="btn btn-sm btn-outline-danger room-delete-btn"
data-room-id="${room.id}"
data-testid="btn-room-delete">

Xóa

</button>

</td>

</tr>
`;

}

/**
 * Xử lý các nút trong bảng.
 *
 * @param {MouseEvent} event
 */
function handleTableClick(event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const roomId = button.dataset.roomId;

  if (!roomId) {
    return;
  }

  if (button.classList.contains("room-detail-btn")) {
    handleRoomDetail(roomId);
    return;
  }

  if (button.classList.contains("room-edit-btn")) {
    handleEditRoom(roomId);
    return;
  }

  if (button.classList.contains("room-delete-btn")) {
    handleDeleteRoom(roomId);
  }
}

/**
 * Thêm phòng.
 */
function handleAddRoom() {
  clearErrors();

  openRoomForm(null, (data) => {
    try {
      createRoom(data);

      closeRoomForm();

      renderRoomsTable();

      showToast(
        "Thêm phòng thành công.",
        "success"
      );
    } catch (error) {
      handleFormError(error);
    }
  });
}

/**
 * Sửa phòng.
 *
 * @param {string} roomId
 */
function handleEditRoom(roomId) {
  try {
    const room = getRoomById(roomId);

    clearErrors();

    openRoomForm(room, (data) => {
      try {
        updateRoom(roomId, data);

        closeRoomForm();

        renderRoomsTable();

        showToast(
          "Cập nhật phòng thành công.",
          "success"
        );
      } catch (error) {
        handleFormError(error);
      }
    });
  } catch (error) {
    showToast(error.message, "danger");
  }
}

/**
 * Xóa phòng.
 *
 * @param {string} roomId
 */
function handleDeleteRoom(roomId) {
  showConfirmDialog({
    title: "Xóa phòng",

    message:
      "Bạn có chắc chắn muốn xóa phòng này?",

    onConfirm() {
      try {
        deleteRoom(roomId);

        renderRoomsTable();

        showToast(
          "Đã xóa phòng.",
          "success"
        );
      } catch (error) {
        showToast(
          error.message,
          "danger"
        );
      }
    }
  });
}

/**
 * Xem chi tiết phòng.
 *
 * @param {string} roomId
 */
function handleRoomDetail(roomId) {
  try {
    const room = getRoomById(roomId);

    const message = [
      `Mã phòng: ${room.code}`,
      `Tên phòng: ${room.name}`,
      `Diện tích: ${room.area} m²`,
      `Giá thuê: ${formatCurrency(room.rentPrice)}`,
      `Sức chứa: ${room.maxOccupants} người`,
      `Trạng thái: ${ROOM_STATUS_LABELS[room.status]}`
    ].join("\n");

    showConfirmDialog({
      title: "Chi tiết phòng",
      message,
      confirmText: "Đóng",
      hideCancel: true
    });
  } catch (error) {
    showToast(
      error.message,
      "danger"
    );
  }
}

/**
 * Hiển thị lỗi validation.
 *
 * @param {Error} error
 */
function handleFormError(error) {
  const message = error.message;

  if (message.includes("Mã phòng")) {
    setFieldError(
      "room-code",
      message
    );
    return;
  }

  if (message.includes("Tên phòng")) {
    setFieldError(
      "room-name",
      message
    );
    return;
  }

  if (message.includes("Giá thuê")) {
    setFieldError(
      "room-rent-price",
      message
    );
    return;
  }

  if (message.includes("Diện tích")) {
    setFieldError(
      "room-area",
      message
    );
    return;
  }

  if (message.includes("Số người")) {
    setFieldError(
      "room-max-occupants",
      message
    );
    return;
  }

  showToast(
    message,
    "danger"
  );
}

/**
 * Render badge trạng thái phòng.
 *
 * @param {string} status
 * @returns {string}
 */
function renderStatusBadge(status) {
  const badgeClass = getBadgeClass(status);

  return `
<span class="badge ${badgeClass}">
  ${ROOM_STATUS_LABELS[status] ?? status}
</span>
`;
}

/**
 * Trả về class Bootstrap tương ứng.
 *
 * @param {string} status
 * @returns {string}
 */
function getBadgeClass(status) {
  switch (status) {
    case ROOM_STATUS.AVAILABLE:
      return "bg-success";

    case ROOM_STATUS.OCCUPIED:
      return "bg-primary";

    case ROOM_STATUS.MAINTENANCE:
      return "bg-warning text-dark";

    default:
      return "bg-secondary";
  }
}

/**
 * Làm mới bảng.
 *
 * Có thể được các module khác gọi.
 */
export function refreshRoomsPage() {
  if (!pageElement) {
    return;
  }

  renderRoomsTable();
}

/**
 * Hủy trạng thái trang.
 *
 * Gọi khi router chuyển sang page khác.
 */
export function destroyRoomsPage() {
  pageElement = null;
  tableContainer = null;

  keyword = "";
  statusFilter = "";
  sortPrice = "asc";
}