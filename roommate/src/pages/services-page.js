/**
 * @file services-page.js
 * @description Trang quản lý cấu hình dịch vụ.
 */

import * as ServiceConfigService from "../services/service-config-service.js";

import {
  openCreateServiceForm,
  openEditServiceForm,
  initializeServiceConfigForm
} from "../components/service-config-form.js";

import {
  showToast
} from "../components/toast.js";

import {
  showConfirmDialog
} from "../components/confirm-dialog.js";

import {
  formatCurrency
} from "../utils/currency-utils.js";

let container = null;

let searchKeyword = "";

let statusFilter = "";

/**
 * Render trang.
 *
 * @param {HTMLElement} element
 */
export function render(element) {

  container = element;

  initializeServiceConfigForm();

  renderPage();

}

/**
 * Render toàn bộ.
 */
function renderPage() {

  container.innerHTML = `
<div class="services-page">

<div class="d-flex justify-content-between align-items-center mb-3">

<h2 data-testid="services-title">

Quản lý dịch vụ

</h2>

<button
class="btn btn-primary"
id="add-service-button"
data-testid="add-service">

Thêm dịch vụ

</button>

</div>

${renderToolbar()}

<div
id="services-table-container">

</div>

</div>
`;

  registerEvents();

  renderTable();

}

/**
 * Toolbar.
 *
 * @returns {string}
 */
function renderToolbar() {

  return `
<div class="card mb-3">

<div class="card-body">

<div class="row g-3">

<div class="col-md-6">

<input
class="form-control"
id="service-search"
placeholder="Tìm theo mã hoặc tên..."
value="${searchKeyword}"
data-testid="service-search">

</div>

<div class="col-md-3">

<select
id="service-status-filter"
class="form-select"
data-testid="service-status-filter">

<option value="">
Tất cả trạng thái
</option>

<option value="active">
Đang áp dụng
</option>

<option value="inactive">
Ngưng áp dụng
</option>

</select>

</div>

</div>

</div>

</div>
`;

}

/**
 * Render bảng.
 */
function renderTable() {

  let services =
    ServiceConfigService.getServices();

  if (searchKeyword) {

    services =
      ServiceConfigService.searchServices(
        searchKeyword
      );

  }

  if (statusFilter) {

    services =
      ServiceConfigService.filterServices({

        active:
          statusFilter === "active"

      });

  }

  const table =
    container.querySelector(
      "#services-table-container"
    );

  if (!services.length) {

    table.innerHTML = `
<div class="empty-state">

Không có dịch vụ.

</div>
`;

    return;

  }

  table.innerHTML =
    createTable(services);

}

/**
 * Tạo bảng.
 *
 * @param {Array} services
 * @returns {string}
 */
function createTable(
  services
) {

  return `
<div class="table-responsive">

<table
class="table table-hover align-middle">

<thead>

<tr>

<th>Mã</th>

<th>Tên dịch vụ</th>

<th>Cách tính</th>

<th>Đơn giá</th>

<th>Trạng thái</th>

<th width="260">

Thao tác

</th>

</tr>

</thead>

<tbody>

${services
  .map(createRow)
  .join("")}

</tbody>

</table>

</div>
`;

}

/**
 * Dòng dữ liệu.
 *
 * @param {Object} service
 * @returns {string}
 */
function createRow(
  service
) {

  return `
<tr>

<td>

${service.code}

</td>

<td>

${service.name}

</td>

<td>

${getCalculationLabel(
  service.calculationType
)}

</td>

<td>

${formatCurrency(
  service.unitPrice
)}

</td>

<td>

${createStatusBadge(
  service.active
)}

</td>

<td>

<div class="btn-group btn-group-sm">

<button
class="btn btn-outline-primary edit-button"
data-id="${service.id}"
data-testid="edit-service">

Sửa

</button>

<button
class="btn btn-outline-warning toggle-button"
data-id="${service.id}"
data-testid="toggle-service">

${service.active
  ? "Ngưng"
  : "Kích hoạt"}

</button>

<button
class="btn btn-outline-danger delete-button"
data-id="${service.id}"
data-testid="delete-service">

Xóa

</button>

</div>

</td>

</tr>
`;

}

/**
 * Badge trạng thái.
 *
 * @param {boolean} active
 * @returns {string}
 */
function createStatusBadge(
  active
) {

  return active
    ? `
<span class="badge bg-success">

Đang áp dụng

</span>
`
    : `
<span class="badge bg-secondary">

Ngưng áp dụng

</span>
`;

}

/**
 * Nhãn cách tính.
 *
 * @param {string} type
 * @returns {string}
 */
function getCalculationLabel(
  type
) {

  const labels = {

    usage:
      "Theo lượng sử dụng",

    fixed:
      "Cố định theo phòng",

    perPerson:
      "Theo số người",

    perVehicle:
      "Theo số xe",

    manual:
      "Nhập thủ công"

  };

  return labels[type] ?? type;

}


/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  container
    .querySelector("#add-service-button")
    .addEventListener(
      "click",
      handleAddService
    );

  container
    .querySelector("#service-search")
    .addEventListener(
      "input",
      handleSearch
    );

  container
    .querySelector("#service-status-filter")
    .addEventListener(
      "change",
      handleStatusFilter
    );

  container
    .querySelector("#services-table-container")
    .addEventListener(
      "click",
      handleTableClick
    );

}

/**
 * Thêm dịch vụ.
 */
function handleAddService() {

  openCreateServiceForm(
    (data) => {

      try {

        ServiceConfigService.createService(
          data
        );

        showToast(
          "Đã thêm dịch vụ.",
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
function handleSearch(
  event
) {

  searchKeyword =
    event.target.value.trim();

  renderTable();

}

/**
 * Lọc trạng thái.
 *
 * @param {Event} event
 */
function handleStatusFilter(
  event
) {

  statusFilter =
    event.target.value;

  renderTable();

}

/**
 * Click trong bảng.
 *
 * @param {MouseEvent} event
 */
function handleTableClick(
  event
) {

  const button =
    event.target.closest(
      "button"
    );

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

    editService(id);

    return;

  }

  if (
    button.classList.contains(
      "toggle-button"
    )
  ) {

    toggleService(id);

    return;

  }

  if (
    button.classList.contains(
      "delete-button"
    )
  ) {

    deleteService(id);

  }

}

/**
 * Chỉnh sửa.
 *
 * @param {string} id
 */
function editService(id) {

  const service =
    ServiceConfigService.getServiceById(
      id
    );

  openEditServiceForm(
    service,
    (data) => {

      try {

        ServiceConfigService.updateService(
          id,
          data
        );

        showToast(
          "Đã cập nhật dịch vụ.",
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
 * Đổi trạng thái.
 *
 * @param {string} id
 */
function toggleService(
  id
) {

  const service =
    ServiceConfigService.getServiceById(
      id
    );

  const activating =
    !service.active;

  showConfirmDialog({

    title:
      activating
        ? "Kích hoạt dịch vụ"
        : "Ngưng áp dụng",

    message:
      activating
        ? "Kích hoạt lại dịch vụ?"
        : "Ngưng áp dụng dịch vụ này?",

    confirmText:
      activating
        ? "Kích hoạt"
        : "Ngưng",

    onConfirm() {

      try {

        if (activating) {

          ServiceConfigService.activateService(
            id
          );

        } else {

          ServiceConfigService.deactivateService(
            id
          );

        }

        showToast(
          "Đã cập nhật trạng thái.",
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
 * Xóa dịch vụ.
 *
 * @param {string} id
 */
function deleteService(
  id
) {

  showConfirmDialog({

    title:
      "Xóa dịch vụ",

    message:
      "Bạn có chắc muốn xóa dịch vụ này?",

    confirmText:
      "Xóa",

    onConfirm() {

      try {

        ServiceConfigService.deleteService(
          id
        );

        showToast(
          "Đã xóa dịch vụ.",
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
 * Làm mới dữ liệu.
 */
export function refresh() {
  renderTable();
}

/**
 * Xóa toàn bộ bộ lọc.
 */
export function clearFilters() {

  searchKeyword = "";
  statusFilter = "";

  const searchInput =
    container?.querySelector("#service-search");

  if (searchInput) {
    searchInput.value = "";
  }

  const statusSelect =
    container?.querySelector(
      "#service-status-filter"
    );

  if (statusSelect) {
    statusSelect.value = "";
  }

  renderTable();

}

/**
 * Hiển thị thống kê nhanh.
 */
function renderStatistics() {

  const statistics =
    ServiceConfigService.getServiceStatistics();

  return `
<div class="row g-3 mb-3">

<div class="col-md-3">

<div class="card">

<div class="card-body">

<div class="text-muted">
Tổng dịch vụ
</div>

<h4>
${statistics.total}
</h4>

</div>

</div>

</div>

<div class="col-md-3">

<div class="card">

<div class="card-body">

<div class="text-muted">
Đang áp dụng
</div>

<h4 class="text-success">
${statistics.active}
</h4>

</div>

</div>

</div>

<div class="col-md-3">

<div class="card">

<div class="card-body">

<div class="text-muted">
Ngưng áp dụng
</div>

<h4 class="text-secondary">
${statistics.inactive}
</h4>

</div>

</div>

</div>

<div class="col-md-3">

<div class="card">

<div class="card-body">

<div class="text-muted">
Theo sử dụng
</div>

<h4>
${statistics.calculationTypes.usage}
</h4>

</div>

</div>

</div>

</div>
`;

}

/**
 * Trả về tiêu đề cách tính.
 *
 * @param {string} type
 * @returns {string}
 */
export function getCalculationTypeLabel(type) {

  switch (type) {

    case "usage":
      return "Theo lượng sử dụng";

    case "fixed":
      return "Cố định theo phòng";

    case "perPerson":
      return "Theo số người";

    case "perVehicle":
      return "Theo số xe";

    case "manual":
      return "Nhập thủ công";

    default:
      return type;

  }

}

/**
 * Kiểm tra trang đã render.
 *
 * @returns {boolean}
 */
export function isRendered() {
  return Boolean(container);
}

/**
 * Hủy trang.
 */
export function destroy() {

  container = null;

  searchKeyword = "";
  statusFilter = "";

}