/**
 * @file contracts-page.js
 * @description Trang quản lý hợp đồng.
 */

import * as ContractService from "../services/contract-service.js";
import * as RoomService from "../services/room-service.js";

import {
    openContractForm,
    initializeContractForm
} from "../components/contract-form.js";

import {
    openContractDetail,
    initializeContractDetail
} from "../components/contract-detail.js";

import {
    showToast
} from "../components/toast.js";

import {
    showConfirmDialog
} from "../components/confirm-dialog.js";

import {
    formatDate
} from "../utils/date-utils.js";

import {
    formatCurrency
} from "../utils/currency-utils.js";

let container = null;

let searchKeyword = "";

let statusFilter = "";

let roomFilter = "";

let sortDirection = "desc";

/**
 * Render trang.
 *
 * @param {HTMLElement} element
 */
export function render(element) {

    container = element;

    initializeContractForm();

    initializeContractDetail();

    renderPage();

}

/**
 * Render toàn bộ.
 */
function renderPage() {

    container.innerHTML = `
<div class="contracts-page">

<div class="d-flex justify-content-between align-items-center mb-3">

<h2
data-testid="contracts-title">

Quản lý hợp đồng

</h2>

<button
class="btn btn-primary"
id="add-contract-button"
data-testid="add-contract">

Thêm hợp đồng

</button>

</div>

${renderToolbar()}

<div
id="contracts-table-container">

</div>

</div>
`;

    registerEvents();

    renderTable();

}


/** tool bar */
function renderToolbar() {

    const rooms =
        RoomService.getRooms();

    return `
<div class="card mb-3">

<div class="card-body">

<div class="row g-3">

<div class="col-md-4">

<input
class="form-control"
id="contract-search"
placeholder="Tìm theo mã..."
value="${searchKeyword}"
data-testid="contract-search">

</div>

<div class="col-md-3">

<select
id="contract-status-filter"
class="form-select"
data-testid="contract-status-filter">

<option value="">

Tất cả trạng thái

</option>

<option value="draft">

Bản nháp

</option>

<option value="active">

Hiệu lực

</option>

<option value="expired">

Hết hạn

</option>

<option value="cancelled">

Đã hủy

</option>

</select>

</div>

<div class="col-md-3">

<select
id="contract-room-filter"
class="form-select"
data-testid="contract-room-filter">

<option value="">

Tất cả phòng

</option>

${rooms.map(room => `
<option value="${room.id}">
${room.code}
</option>
`).join("")}

</select>

</div>

<div class="col-md-2">

<select
id="contract-sort"
class="form-select">

<option value="desc">

Mới nhất

</option>

<option value="asc">

Cũ nhất

</option>

</select>

</div>

</div>

</div>

</div>
`;

}
/**render bảng */

function renderTable() {

    let contracts =
        ContractService.getContracts();

    if (searchKeyword) {

        contracts =
            ContractService.searchContracts(
                searchKeyword
            );

    }

    if (
        statusFilter ||
        roomFilter
    ) {

        contracts =
            ContractService.filterContracts({

                status:
                    statusFilter,

                roomId:
                    roomFilter

            });

    }

    contracts.sort((a, b) => {

        if (sortDirection === "asc") {

            return new Date(a.startDate)
                -
                new Date(b.startDate);

        }

        return new Date(b.startDate)
            -
            new Date(a.startDate);

    });

    const table =
        container.querySelector(
            "#contracts-table-container"
        );

    if (!contracts.length) {

        table.innerHTML = `
<div class="empty-state">

Không có hợp đồng.

</div>
`;

        return;

    }

    table.innerHTML =
        createTable(contracts);

}


/** tạo bảng */
function createTable(contracts) {

    return `
<table
class="table table-hover align-middle">

<thead>

<tr>

<th>Mã</th>

<th>Phòng</th>

<th>Người thuê</th>

<th>Bắt đầu</th>

<th>Kết thúc</th>

<th>Giá thuê</th>

<th>Trạng thái</th>

<th width="260">

Thao tác

</th>

</tr>

</thead>

<tbody>

${contracts.map(createRow).join("")}

</tbody>

</table>
`;

}

/** dòng dữ liệu */

function createRow(contract) {

  return `
<tr>

<td>${contract.contractNumber}</td>

<td>${contract.roomCode}</td>

<td>${contract.tenantName}</td>

<td>${formatDate(contract.startDate)}</td>

<td>${formatDate(contract.endDate)}</td>

<td>${formatCurrency(contract.rentPrice)}</td>

<td>

${createStatusBadge(contract.status)}

</td>

<td>

<div class="btn-group btn-group-sm">

<button
class="btn btn-outline-primary detail-button"
data-id="${contract.id}"
data-testid="detail-contract">

Chi tiết

</button>

<button
class="btn btn-outline-secondary edit-button"
data-id="${contract.id}"
data-testid="edit-contract">

Sửa

</button>

<button
class="btn btn-outline-success activate-button"
data-id="${contract.id}"
data-testid="activate-contract">

Kích hoạt

</button>

<button
class="btn btn-outline-warning extend-button"
data-id="${contract.id}"
data-testid="extend-contract">

Gia hạn

</button>

<button
class="btn btn-outline-danger end-button"
data-id="${contract.id}"
data-testid="end-contract">

Kết thúc

</button>

<button
class="btn btn-outline-dark cancel-button"
data-id="${contract.id}"
data-testid="cancel-contract">

Hủy

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
    .querySelector("#add-contract-button")
    .addEventListener("click", handleAddContract);

  container
    .querySelector("#contract-search")
    .addEventListener("input", handleSearch);

  container
    .querySelector("#contract-status-filter")
    .addEventListener("change", handleStatusFilter);

  container
    .querySelector("#contract-room-filter")
    .addEventListener("change", handleRoomFilter);

  container
    .querySelector("#contract-sort")
    .addEventListener("change", handleSort);

  container
    .querySelector("#contracts-table-container")
    .addEventListener("click", handleTableClick);
}

/**
 * Thêm hợp đồng.
 */
function handleAddContract() {
  openContractForm(
    null,
    (data) => {
      try {
        ContractService.createContract(data);

        showToast(
          "Tạo hợp đồng thành công.",
          "success"
        );

        renderTable();

      } catch (error) {
        throw error;
      }
    }
  );
}

/**
 * Tìm kiếm.
 *
 * @param {Event} event
 */
function handleSearch(event) {
  searchKeyword =
    event.target.value.trim();

  renderTable();
}

/**
 * Lọc trạng thái.
 *
 * @param {Event} event
 */
function handleStatusFilter(event) {
  statusFilter =
    event.target.value;

  renderTable();
}

/**
 * Lọc phòng.
 *
 * @param {Event} event
 */
function handleRoomFilter(event) {
  roomFilter =
    event.target.value;

  renderTable();
}

/**
 * Sắp xếp.
 *
 * @param {Event} event
 */
function handleSort(event) {
  sortDirection =
    event.target.value;

  renderTable();
}

/**
 * Xử lý thao tác trên bảng.
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
      "detail-button"
    )
  ) {
    showDetail(id);
    return;
  }

  if (
    button.classList.contains(
      "edit-button"
    )
  ) {
    editContract(id);
    return;
  }

  if (
    button.classList.contains(
      "activate-button"
    )
  ) {
    activateContract(id);
    return;
  }

  if (
    button.classList.contains(
      "end-button"
    )
  ) {
    endContract(id);
    return;
  }

  if (
  button.classList.contains(
    "extend-button"
  )
) {
  extendContract(id);
  return;
}

if (
  button.classList.contains(
    "cancel-button"
  )
) {
  cancelContract(id);
  return;
}

}

/** xem chi tiết */
/**
 * Xem chi tiết.
 *
 * @param {string} id
 */
function showDetail(id) {

  const contract =
    ContractService.getContractById(
      id
    );

  openContractDetail(contract);

}

/** sửa hợp đồng */
/**
 * Sửa hợp đồng.
 *
 * @param {string} id
 */
function editContract(id) {

  const contract =
    ContractService.getContractById(
      id
    );

  openContractForm(
    contract,
    (data) => {

      try {

        ContractService.updateContract(
          id,
          data
        );

        showToast(
          "Cập nhật thành công.",
          "success"
        );

        renderTable();

      } catch (error) {

        throw error;

      }

    }
  );

}

/** kích hoạt hợp đồng */

/**
 * Kích hoạt.
 *
 * @param {string} id
 */
function activateContract(id) {

  showConfirmDialog({

    title:
      "Kích hoạt hợp đồng",

    message:
      "Bạn có chắc muốn kích hoạt?",

    confirmText:
      "Kích hoạt",

    onConfirm() {

      try {

        ContractService.activateContract(
          id
        );

        showToast(
          "Đã kích hoạt.",
          "success"
        );

        renderTable();

      } catch (error) {

        showToast(
          error.message,
          "danger"
        );

      }

    }

  });

}

/** kết thúc hợp đồng  */

/**
 * Kết thúc hợp đồng.
 *
 * @param {string} id
 */
function endContract(id) {

  showConfirmDialog({

    title:
      "Kết thúc hợp đồng",

    message:
      "Xác nhận kết thúc hợp đồng?",

    confirmText:
      "Kết thúc",

    onConfirm() {

      try {

        ContractService.endContract(
          id
        );

        showToast(
          "Hợp đồng đã kết thúc.",
          "success"
        );

        renderTable();

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
 * Gia hạn hợp đồng.
 *
 * @param {string} id
 */
function extendContract(id) {

  const contract =
    ContractService.getContractById(id);

  const currentEnd =
    contract.endDate.substring(0, 10);

  const newEndDate =
    window.prompt(
      "Nhập ngày kết thúc mới (yyyy-mm-dd)",
      currentEnd
    );

  if (!newEndDate) {
    return;
  }

  try {

    ContractService.extendContract(
      id,
      newEndDate
    );

    showToast(
      "Gia hạn hợp đồng thành công.",
      "success"
    );

    renderTable();

  } catch (error) {

    showToast(
      error.message,
      "danger"
    );

  }

}

/**
 * Hủy hợp đồng.
 *
 * @param {string} id
 */
function cancelContract(id) {

  showConfirmDialog({

    title: "Hủy hợp đồng",

    message:
      "Bạn có chắc muốn hủy hợp đồng?",

    confirmText: "Hủy hợp đồng",

    onConfirm() {

      try {

        ContractService.cancelContract(id);

        showToast(
          "Đã hủy hợp đồng.",
          "warning"
        );

        renderTable();

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
 * Hiển thị hợp đồng sắp hết hạn.
 */
function showExpiringContracts() {

  const contracts =
    ContractService.getExpiringContracts(30);

  if (!contracts.length) {

    showToast(
      "Không có hợp đồng sắp hết hạn.",
      "info"
    );

    return;

  }

  container.querySelector(
    "#contracts-table-container"
  ).innerHTML =
    createTable(contracts);

}

/**
 * Badge trạng thái.
 *
 * @param {string} status
 * @returns {string}
 */
function createStatusBadge(status) {

  const badgeClass = {

    draft: "bg-secondary",

    pending: "bg-warning",

    active: "bg-success",

    expired: "bg-dark",

    cancelled: "bg-danger"

  };

  const label = {

    draft: "Bản nháp",

    pending: "Chờ hiệu lực",

    active: "Hiệu lực",

    expired: "Hết hạn",

    cancelled: "Đã hủy"

  };

  return `
<span
class="badge ${badgeClass[status] ?? "bg-secondary"}">

${label[status] ?? status}

</span>
`;

}

