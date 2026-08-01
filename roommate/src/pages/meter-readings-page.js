/**
 * @file meter-readings-page.js
 * @description Trang ghi chỉ số điện nước.
 */

import * as MeterReadingService from "../services/meter-reading-service.js";

import {
  openCreateMeterReadingForm,
  openEditMeterReadingForm,
  initializeMeterReadingForm,
  showUsageWarning
} from "../components/meter-reading-form.js";

import {
  showToast
} from "../components/toast.js";

import {
  showConfirmDialog
} from "../components/confirm-dialog.js";

let container = null;

let selectedMonth =
  new Date()
    .toISOString()
    .slice(0, 7);

let selectedRoom = "";

/**
 * Render trang.
 *
 * @param {HTMLElement} element
 */
export function render(element) {

  container = element;

  initializeMeterReadingForm();

  renderPage();

}

/**
 * Render toàn bộ.
 */
function renderPage() {

  container.innerHTML = `
<div class="meter-readings-page">

<div class="d-flex justify-content-between align-items-center mb-3">

<h2 data-testid="meter-readings-title">

Ghi chỉ số điện nước

</h2>

<button
class="btn btn-primary"
id="add-reading-button"
data-testid="add-reading">

Thêm chỉ số

</button>

</div>

${renderToolbar()}

<div
id="rooms-without-reading"
class="mb-3">
</div>

<div
id="meter-reading-table">
</div>

</div>
`;

  renderRoomsWithoutReading();

  renderTable();

  registerEvents();

}

/**
 * Toolbar.
 */
function renderToolbar() {

  return `
<div class="card mb-3">

<div class="card-body">

<div class="row g-3">

<div class="col-md-4">

<label class="form-label">

Tháng

</label>

<input
type="month"
id="filter-month"
class="form-control"
value="${selectedMonth}"
data-testid="filter-month">

</div>

<div class="col-md-4">

<label class="form-label">

Phòng

</label>

<select
id="filter-room"
class="form-select"
data-testid="filter-room">

<option value="">

Tất cả phòng

</option>

${createRoomOptions()}

</select>

</div>

</div>

</div>

</div>
`;

}

/**
 * Option phòng.
 *
 * @returns {string}
 */
function createRoomOptions() {

  const rooms =
    MeterReadingService
      .getRoomsWithoutReading(
        "1900-01"
      )
      .concat(
        MeterReadingService
          .getReadings()
          .map(
            (reading) => ({
              id: reading.roomId,
              code:
                reading.roomCode ??
                reading.roomId
            })
          )
      );

  const unique =
    [...new Map(
      rooms.map(room => [
        room.id,
        room
      ])
    ).values()];

  return unique
    .map(room => `
<option
value="${room.id}"
${selectedRoom === room.id ? "selected" : ""}>

${room.code}

</option>
`)
    .join("");

}


/**
 * Render phòng chưa ghi.
 */
function renderRoomsWithoutReading() {

  const rooms =
    MeterReadingService
      .getRoomsWithoutReading(
        selectedMonth
      );

  const containerElement =
    container.querySelector(
      "#rooms-without-reading"
    );

  if (!rooms.length) {

    containerElement.innerHTML =
      "";

    return;

  }

  containerElement.innerHTML = `
<div
class="alert alert-warning"
data-testid="rooms-without-reading">

<strong>

Chưa ghi chỉ số:

</strong>

${rooms
  .map(room => room.code)
  .join(", ")}

</div>
`;

}


/**
 * Render bảng.
 */
function renderTable() {

  let readings =
    MeterReadingService.filterReadings({

      monthKey:
        selectedMonth,

      roomId:
        selectedRoom || undefined

    });

  const table =
    container.querySelector(
      "#meter-reading-table"
    );

  if (!readings.length) {

    table.innerHTML = `
<div class="empty-state">

Chưa có dữ liệu.

</div>
`;

    return;

  }

  table.innerHTML =
    createTable(readings);

}


function createTable(
  readings
) {

  return `
<div class="table-responsive">

<table
class="table table-hover">

<thead>

<tr>

<th>Phòng</th>

<th>Tháng</th>

<th>Điện</th>

<th>Nước</th>

<th width="220">

Thao tác

</th>

</tr>

</thead>

<tbody>

${readings
  .map(createRow)
  .join("")}

</tbody>

</table>

</div>
`;

}

function createRow(
  reading
) {

  return `
<tr>

<td>

${reading.roomCode ?? reading.roomId}

</td>

<td>

${reading.monthKey}

</td>

<td>

${reading.electricUsage}

kWh

</td>

<td>

${reading.waterUsage}

m³

</td>

<td>

<div class="btn-group btn-group-sm">

<button
class="btn btn-outline-primary edit-button"
data-id="${reading.id}"
data-testid="edit-reading">

Sửa

</button>

<button
class="btn btn-outline-danger delete-button"
data-id="${reading.id}"
data-testid="delete-reading">

Xóa

</button>

</div>

</td>

</tr>
`;

}


/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  container
    .querySelector("#add-reading-button")
    .addEventListener(
      "click",
      handleAddReading
    );

  container
    .querySelector("#filter-month")
    .addEventListener(
      "change",
      handleMonthChange
    );

  container
    .querySelector("#filter-room")
    .addEventListener(
      "change",
      handleRoomChange
    );

  container
    .querySelector("#meter-reading-table")
    .addEventListener(
      "click",
      handleTableClick
    );

}

/**
 * Đổi tháng.
 *
 * @param {Event} event
 */
function handleMonthChange(event) {

  selectedMonth =
    event.target.value;

  renderRoomsWithoutReading();

  renderTable();

}

/**
 * Đổi phòng.
 *
 * @param {Event} event
 */
function handleRoomChange(event) {

  selectedRoom =
    event.target.value;

  renderTable();

}

/**
 * Click bảng.
 *
 * @param {MouseEvent} event
 */
function handleTableClick(event) {

  const button =
    event.target.closest("button");

  if (!button) {
    return;
  }

  const id =
    button.dataset.id;

  if (!id) {
    return;
  }

  if (
    button.classList.contains(
      "edit-button"
    )
  ) {

    editReading(id);

    return;

  }

  if (
    button.classList.contains(
      "delete-button"
    )
  ) {

    deleteReading(id);

  }

}

/**
 * Thêm chỉ số.
 */
function handleAddReading() {

  openCreateMeterReadingForm(
    (data) => {

      try {

        const result =
          MeterReadingService.createReading(
            data
          );

        if (result.warning) {

          showUsageWarning(
            result.warning
          );

        }

        showToast(
          "Đã lưu chỉ số.",
          "success"
        );

        refreshPage();

      } catch (error) {

        throw error;

      }

    }
  );

}

/**
 * Sửa chỉ số.
 *
 * @param {string} id
 */
function editReading(id) {

  const reading =
    MeterReadingService.getReadingById(
      id
    );

  openEditMeterReadingForm(
    reading,
    (data) => {

      try {

        const result =
          MeterReadingService.updateReading(
            id,
            data
          );

        if (result.warning) {

          showUsageWarning(
            result.warning
          );

        }

        showToast(
          "Đã cập nhật chỉ số.",
          "success"
        );

        refreshPage();

      } catch (error) {

        throw error;

      }

    }
  );

}


/**
 * Xóa bản ghi.
 *
 * @param {string} id
 */
function deleteReading(id) {

  showConfirmDialog({

    title:
      "Xóa bản ghi",

    message:
      "Bạn có chắc muốn xóa bản ghi chỉ số này?",

    confirmText:
      "Xóa",

    onConfirm() {

      try {

        MeterReadingService.deleteReading(
          id
        );

        showToast(
          "Đã xóa bản ghi.",
          "success"
        );

        refreshPage();

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
 * Làm mới dữ liệu.
 */
function refreshPage() {

    renderStatistics();

    renderRoomsWithoutReading();

    renderTable();

}


/**
 * Làm mới trang.
 */
export function refresh() {

  renderRoomsWithoutReading();

  renderTable();

}

/**
 * Xóa toàn bộ bộ lọc.
 */
export function clearFilters() {

  selectedRoom = "";

  selectedMonth =
    new Date()
      .toISOString()
      .slice(0, 7);

  const monthInput =
    container?.querySelector(
      "#filter-month"
    );

  if (monthInput) {
    monthInput.value =
      selectedMonth;
  }

  const roomSelect =
    container?.querySelector(
      "#filter-room"
    );

  if (roomSelect) {
    roomSelect.value = "";
  }

  refresh();

}

/**
 * Render thống kê.
 */
function renderStatistics() {

  const readings =
    MeterReadingService.filterReadings({
      monthKey: selectedMonth
    });

  const totalElectric =
    readings.reduce(
      (sum, item) =>
        sum +
        (item.electricUsage ?? 0),
      0
    );

  const totalWater =
    readings.reduce(
      (sum, item) =>
        sum +
        (item.waterUsage ?? 0),
      0
    );

  const html = `
<div class="row g-3 mb-3">

<div class="col-md-4">

<div class="card">

<div class="card-body">

<div class="text-muted">
Tổng bản ghi
</div>

<h4>
${readings.length}
</h4>

</div>

</div>

</div>

<div class="col-md-4">

<div class="card">

<div class="card-body">

<div class="text-muted">
Điện tiêu thụ
</div>

<h4>
${totalElectric}
kWh
</h4>

</div>

</div>

</div>

<div class="col-md-4">

<div class="card">

<div class="card-body">

<div class="text-muted">
Nước tiêu thụ
</div>

<h4>
${totalWater}
m³
</h4>

</div>

</div>

</div>

</div>
`;

  const old =
    container.querySelector(
      "#meter-statistics"
    );

  if (old) {
    old.remove();
  }

  const wrapper =
    document.createElement("div");

  wrapper.id =
    "meter-statistics";

  wrapper.innerHTML = html;

  const toolbar =
    container.querySelector(
      ".card"
    );

  toolbar?.before(wrapper);

}

/**
 * Kiểm tra trang đã render.
 *
 * @returns {boolean}
 */
export function isRendered() {

  return Boolean(
    container
  );

}

/**
 * Hủy trang.
 */
export function destroy() {

  container = null;

  selectedRoom = "";

  selectedMonth =
    new Date()
      .toISOString()
      .slice(0, 7);

}

/**
 * Render lại toàn bộ.
 */
export function rerender() {

  if (!container) {
    return;
  }

  renderPage();

}

/**
 * Lấy bộ lọc hiện tại.
 *
 * @returns {Object}
 */
export function getFilters() {

  return {

    roomId:
      selectedRoom,

    monthKey:
      selectedMonth

  };

}

/**
 * Đặt bộ lọc.
 *
 * @param {Object} filters
 */
export function setFilters(
  filters = {}
) {

  selectedRoom =
    filters.roomId ?? "";

  selectedMonth =
    filters.monthKey ??
    selectedMonth;

  rerender();

}

/**
 * Render thống kê sau khi
 * dữ liệu thay đổi.
 */
function updateStatistics() {

  renderStatistics();

}
