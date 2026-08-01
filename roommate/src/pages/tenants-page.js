/**
 * @file tenants-page.js
 * @description Trang quản lý người thuê.
 */

import {
  getTenants,
  searchTenants,
  getCurrentRoomOfTenant
} from "../services/tenant-service.js";

import {
  TENANT_STATUS,
  TENANT_STATUS_LABELS
} from "../constants/statuses.js";

import {
  initializeTenantForm
} from "../components/tenant-form.js";

let pageElement = null;
let tableContainer = null;

let keyword = "";
let statusFilter = "";

/**
 * Render trang người thuê.
 *
 * @returns {HTMLElement}
 */
export function renderTenantsPage() {
  initializeTenantForm();

  pageElement = document.createElement("div");
  pageElement.className = "tenants-page";

  pageElement.innerHTML = `
<div class="container-fluid">

<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

<div>

<h2 class="mb-1">
Quản lý người thuê
</h2>

<p class="text-muted mb-0">
Danh sách người thuê trong hệ thống.
</p>

</div>

<button
class="btn btn-primary"
id="btn-add-tenant"
data-testid="btn-add-tenant">

Thêm người thuê

</button>

</div>

<div class="card shadow-sm mb-4">

<div class="card-body">

<div class="row g-3">

<div class="col-lg-6">

<input
class="form-control"
id="tenant-search"
data-testid="tenant-search"
placeholder="Tên, số điện thoại hoặc CCCD">

</div>

<div class="col-lg-3">

<select
class="form-select"
id="tenant-status-filter"
data-testid="tenant-status-filter">

<option value="">
Tất cả trạng thái
</option>

</select>

</div>

</div>

</div>

</div>

<div
id="tenants-table-container"
data-testid="tenants-table-container">
</div>

</div>
`;

  tableContainer =
    pageElement.querySelector(
      "#tenants-table-container"
    );

  populateStatusFilter();

  registerEvents();

  renderTenantsTable();

  return pageElement;
}

/**
 * Đổ trạng thái.
 */
function populateStatusFilter() {

  const select =
    pageElement.querySelector(
      "#tenant-status-filter"
    );

  Object.values(TENANT_STATUS).forEach(
    (status) => {

      const option =
        document.createElement("option");

      option.value = status;
      option.textContent =
        TENANT_STATUS_LABELS[status];

      select.appendChild(option);

    });

}

/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  pageElement
    .querySelector("#tenant-search")
    .addEventListener("input", (event) => {

      keyword = event.target.value.trim();

      renderTenantsTable();

    });

  pageElement
    .querySelector("#tenant-status-filter")
    .addEventListener("change", (event) => {

      statusFilter = event.target.value;

      renderTenantsTable();

    });

  tableContainer.addEventListener(
    "click",
    handleTableClick
  );

}

/**
 * Render bảng.
 */
function renderTenantsTable() {

  let tenants =
    keyword
      ? searchTenants(keyword)
      : getTenants();

  if (statusFilter) {
    tenants = tenants.filter(
      (tenant) =>
        tenant.status === statusFilter
    );
  }

  if (tenants.length === 0) {

    tableContainer.innerHTML = `
<div class="card">

<div
class="card-body text-center py-5"
data-testid="empty-state">

<h5>
Không có người thuê
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
data-testid="tenants-table">

<thead>

<tr>

<th>Họ tên</th>

<th>SĐT</th>

<th>CCCD</th>

<th>Phòng hiện tại</th>

<th>Trạng thái</th>

<th width="260">
Thao tác
</th>

</tr>

</thead>

<tbody>

${tenants.map(renderTenantRow).join("")}

</tbody>

</table>

</div>
`;

}

/**
 * Render một dòng.
 *
 * @param {Object} tenant
 * @returns {string}
 */
function renderTenantRow(tenant) {

  const room =
    getCurrentRoomOfTenant(
      tenant.id
    );

  return `
<tr>

<td>${tenant.fullName}</td>

<td>${tenant.phoneNumber}</td>

<td>${tenant.identityNumber || "-"}</td>

<td>
${room
  ? `${room.code} - ${room.name}`
  : "-"}
</td>

<td>
${renderStatusBadge(
  tenant.status
)}
</td>

<td>

<button
class="btn btn-sm btn-outline-info tenant-history-btn"
data-tenant-id="${tenant.id}"
data-testid="btn-tenant-history">

Lịch sử

</button>

<button
class="btn btn-sm btn-outline-primary tenant-edit-btn"
data-tenant-id="${tenant.id}"
data-testid="btn-tenant-edit">

Sửa

</button>

<button
class="btn btn-sm btn-outline-warning tenant-archive-btn"
data-tenant-id="${tenant.id}"
data-testid="btn-tenant-archive">

Lưu trữ

</button>

<button
class="btn btn-sm btn-outline-danger tenant-delete-btn"
data-tenant-id="${tenant.id}"
data-testid="btn-tenant-delete">

Xóa

</button>

</td>

</tr>
`;

}

import {
  getTenantById,
  createTenant,
  updateTenant,
  archiveTenant,
  deleteTenant,
  getTenantRentalHistory
} from "../services/tenant-service.js";

import {
  openTenantForm,
  closeTenantForm,
  clearErrors,
  setFieldError
} from "../components/tenant-form.js";

import {
  showToast
} from "../components/toast.js";

import {
  showConfirmDialog
} from "../components/confirm-dialog.js";

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

  const tenantId = button.dataset.tenantId;

  if (!tenantId) {
    return;
  }

  if (button.classList.contains("tenant-history-btn")) {
    handleHistory(tenantId);
    return;
  }

  if (button.classList.contains("tenant-edit-btn")) {
    handleEdit(tenantId);
    return;
  }

  if (button.classList.contains("tenant-archive-btn")) {
    handleArchive(tenantId);
    return;
  }

  if (button.classList.contains("tenant-delete-btn")) {
    handleDelete(tenantId);
  }
}

/**
 * Thêm người thuê.
 */
function handleAddTenant() {
  clearErrors();

  openTenantForm(null, (data) => {
    try {
      createTenant(data);

      closeTenantForm();

      renderTenantsTable();

      showToast(
        "Đã thêm người thuê.",
        "success"
      );

    } catch (error) {
      handleFormError(error);
    }
  });
}

/**
 * Sửa người thuê.
 *
 * @param {string} tenantId
 */
function handleEdit(tenantId) {

  try {

    const tenant =
      getTenantById(tenantId);

    clearErrors();

    openTenantForm(
      tenant,
      (data) => {

        try {

          updateTenant(
            tenantId,
            data
          );

          closeTenantForm();

          renderTenantsTable();

          showToast(
            "Đã cập nhật người thuê.",
            "success"
          );

        } catch (error) {

          handleFormError(error);

        }

      }
    );

  } catch (error) {

    showToast(
      error.message,
      "danger"
    );

  }

}

/**
 * Lưu trữ người thuê.
 *
 * @param {string} tenantId
 */
function handleArchive(tenantId) {

  showConfirmDialog({

    title: "Lưu trữ",

    message:
      "Bạn có muốn lưu trữ người thuê này?",

    onConfirm() {

      try {

        archiveTenant(tenantId);

        renderTenantsTable();

        showToast(
          "Đã lưu trữ.",
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
 * Xóa người thuê.
 *
 * @param {string} tenantId
 */
function handleDelete(tenantId) {

  showConfirmDialog({

    title: "Xóa người thuê",

    message:
      "Bạn có chắc chắn muốn xóa người thuê này?",

    onConfirm() {

      try {

        deleteTenant(tenantId);

        renderTenantsTable();

        showToast(
          "Đã xóa người thuê.",
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
 * Hiển thị lịch sử thuê.
 *
 * @param {string} tenantId
 */
function handleHistory(tenantId) {

  try {

    const history =
      getTenantRentalHistory(
        tenantId
      );

    if (history.length === 0) {

      showToast(
        "Người thuê chưa có lịch sử thuê.",
        "info"
      );

      return;

    }

    const message = history
      .map((item) => {

        return [
          item.roomCode,
          item.roomName,
          item.startDate,
          item.endDate
        ].join(" | ");

      })
      .join("\n");

    showConfirmDialog({

      title: "Lịch sử thuê",

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

  if (message.includes("Họ tên")) {

    setFieldError(
      "tenant-full-name",
      message
    );

    return;

  }

  if (message.includes("điện thoại")) {

    setFieldError(
      "tenant-phone-number",
      message
    );

    return;

  }

  if (message.includes("CCCD")) {

    setFieldError(
      "tenant-identity-number",
      message
    );

    return;

  }

  if (message.includes("Email")) {

    setFieldError(
      "tenant-email",
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
 * Render badge trạng thái.
 *
 * @param {string} status
 * @returns {string}
 */
function renderStatusBadge(status) {
  const badgeClass = {
    active: "bg-success",
    inactive: "bg-secondary",
    archived: "bg-dark"
  };

  return `
<span class="badge ${badgeClass[status] ?? "bg-secondary"}">
  ${TENANT_STATUS_LABELS[status] ?? status}
</span>
`;
}

/**
 * Render lại bảng.
 */
export function refreshTenantsPage() {
  if (!pageElement) {
    return;
  }

  renderTenantsTable();
}

/**
 * Hủy trang.
 */
export function destroyTenantsPage() {
  if (!pageElement) {
    return;
  }

  tableContainer?.removeEventListener(
    "click",
    handleTableClick
  );

  pageElement = null;
  tableContainer = null;

  keyword = "";
  statusFilter = "";
}

/**
 * Lấy phần tử gốc của trang.
 *
 * @returns {HTMLElement|null}
 */
export function getTenantsPageElement() {
  return pageElement;
}