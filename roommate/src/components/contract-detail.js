/**
 * @file contract-detail.js
 * @description Hiển thị chi tiết hợp đồng dưới dạng Bootstrap Modal.
 */

import { Modal } from "bootstrap";

import {
  formatDate
} from "../utils/date-utils.js";

import {
  formatCurrency
} from "../utils/currency-utils.js";

import {
  CONTRACT_STATUS_LABELS
} from "../constants/statuses.js";

let modalElement = null;
let modalInstance = null;

/**
 * Khởi tạo modal.
 */
export function initializeContractDetail() {

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
        data-testid="contract-detail-title">

        Chi tiết hợp đồng

      </h5>

      <button
        class="btn-close"
        data-bs-dismiss="modal">
      </button>

    </div>

    <div class="modal-body">

      <div
        id="contract-detail-content"
        data-testid="contract-detail-content">

      </div>

    </div>

    <div class="modal-footer">

      <button
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        data-testid="contract-detail-close">

        Đóng

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

}

/**
 * Hiển thị chi tiết.
 *
 * @param {Object} contract
 */
export function openContractDetail(
  contract
) {

  if (!modalInstance) {

    initializeContractDetail();

  }

  if (!contract) {

    throw new Error(
      "Không có dữ liệu hợp đồng."
    );

  }

  const container =
    modalElement.querySelector(
      "#contract-detail-content"
    );

  container.innerHTML =
    createDetailHtml(contract);

  modalInstance.show();

}

/**
 * Đóng modal.
 */
export function closeContractDetail() {

  modalInstance?.hide();

}

/**
 * Sinh HTML.
 *
 * @param {Object} contract
 * @returns {string}
 */
function createDetailHtml(
  contract
) {

  return `
<div class="container-fluid">

<div class="row mb-3">

<div class="col-md-6">

<strong>Mã hợp đồng</strong>

<div>
${escapeHtml(contract.contractNumber ?? "-")}
</div>

</div>

<div class="col-md-6">

<strong>Trạng thái</strong>

<div>

${renderStatusBadge(contract.status)}

</div>

</div>

</div>

<hr>

<div class="row mb-3">

<div class="col-md-6">

<strong>Phòng</strong>

<div>

${escapeHtml(contract.roomCode ?? "-")}

-

${escapeHtml(contract.roomName ?? "-")}

</div>

</div>

<div class="col-md-6">

<strong>Người đại diện</strong>

<div>

${escapeHtml(contract.tenantName ?? "-")}

</div>

</div>

</div>

<div class="mb-3">

<strong>Người ở cùng</strong>

<ul class="mb-0">

${renderTenantList(
  contract.coTenants
)}

</ul>

</div>

<hr>

<div class="row mb-3">

<div class="col-md-6">

<strong>Ngày bắt đầu</strong>

<div>

${formatSafeDate(
  contract.startDate
)}

</div>

</div>

<div class="col-md-6">

<strong>Ngày kết thúc</strong>

<div>

${formatSafeDate(
  contract.endDate
)}

</div>

</div>

</div>

<div class="row mb-3">

<div class="col-md-6">

<strong>Giá thuê</strong>

<div>

${formatCurrency(
  contract.rentPrice ?? 0
)}

</div>

</div>

<div class="col-md-6">

<strong>Tiền cọc</strong>

<div>

${formatCurrency(
  contract.deposit ?? 0
)}

</div>

</div>

</div>

<div>

<strong>Ghi chú</strong>

<div class="border rounded p-2 bg-light">

${escapeHtml(
  contract.notes || "Không có ghi chú."
)}

</div>

</div>

</div>
`;

}

/**
 * Badge trạng thái.
 *
 * @param {string} status
 * @returns {string}
 */
function renderStatusBadge(
  status
) {

  const classes = {

    draft: "bg-secondary",

    pending: "bg-warning",

    active: "bg-success",

    expired: "bg-dark",

    cancelled: "bg-danger"

  };

  return `
<span
class="badge ${classes[status] ?? "bg-secondary"}">

${CONTRACT_STATUS_LABELS[status] ?? status}

</span>
`;

}

/**
 * Danh sách người ở cùng.
 *
 * @param {Array} tenants
 * @returns {string}
 */
function renderTenantList(
  tenants = []
) {

  if (!tenants.length) {

    return `
<li>
Không có
</li>
`;

  }

  return tenants
    .map(
      (tenant) => `
<li>

${escapeHtml(
  tenant.fullName ??
  tenant.name ??
  ""
)}

</li>
`
    )
    .join("");

}

/**
 * Format ngày.
 *
 * @param {string} value
 * @returns {string}
 */
function formatSafeDate(
  value
) {

  try {

    return formatDate(value);

  } catch {

    return "-";

  }

}

/**
 * Escape HTML.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(
  value
) {

  const div =
    document.createElement("div");

  div.textContent =
    value ?? "";

  return div.innerHTML;

}