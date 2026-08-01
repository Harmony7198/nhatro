/**
 * @file invoices-page.js
 */

import * as InvoiceService from "../services/invoice-service.js";
import {
  openInvoiceForm
} from "../components/invoice-form.js";
import {
  openInvoiceDetail
} from "../components/invoice-detail.js";
import {
  showToast
} from "../components/toast.js";
import {
  showConfirmDialog
} from "../components/confirm-dialog.js";

let container = null;

let selectedMonth = "";
let selectedRoom = "";
let selectedStatus = "";
let keyword = "";

/**
 * Render page.
 *
 * @param {HTMLElement} element
 */
export function render(element) {

  container = element;

  selectedMonth =
    new Date()
      .toISOString()
      .slice(0, 7);

  renderPage();

}

function renderPage() {

  container.innerHTML = `

<div class="invoices-page">

<div class="d-flex justify-content-between align-items-center mb-4">

<h2 data-testid="invoice-title">
Hóa đơn
</h2>

<div class="btn-group">

<button
class="btn btn-primary"
id="create-invoice-button"
data-testid="create-invoice">

Tạo hóa đơn

</button>

<button
class="btn btn-success"
id="generate-month-button"
data-testid="generate-month">

Tạo hàng loạt

</button>

</div>

</div>

<div class="card mb-3">

<div class="card-body">

<div class="row g-3">

<div class="col-md-3">

<input

id="invoice-keyword"

class="form-control"

placeholder="Mã hóa đơn..."

data-testid="invoice-search"

>

</div>

<div class="col-md-3">

<input

type="month"

id="invoice-month"

class="form-control"

value="${selectedMonth}"

data-testid="invoice-month"

>

</div>

<div class="col-md-3">

<select

id="invoice-room"

class="form-select"

data-testid="invoice-room">

<option value="">
Tất cả phòng
</option>

</select>

</div>

<div class="col-md-3">

<select

id="invoice-status"

class="form-select"

data-testid="invoice-status">

<option value="">
Tất cả trạng thái
</option>

<option value="draft">
Nháp
</option>

<option value="unpaid">
Chưa thanh toán
</option>

<option value="partial">
Thanh toán một phần
</option>

<option value="paid">
Đã thanh toán
</option>

<option value="overdue">
Quá hạn
</option>

<option value="cancelled">
Đã hủy
</option>

</select>

</div>

</div>

</div>

</div>

<div id="invoice-summary"></div>

<div class="card">

<div class="table-responsive">

<table
class="table table-hover align-middle mb-0"
data-testid="invoice-table">

<thead>

<tr>

<th>Mã</th>

<th>Phòng</th>

<th>Tháng</th>

<th>Tổng tiền</th>

<th>Đã trả</th>

<th>Còn nợ</th>

<th>Trạng thái</th>

<th></th>

</tr>

</thead>

<tbody id="invoice-table-body">

</tbody>

</table>

</div>

</div>

</div>

`;

  renderSummary();

  renderTable();

  registerEvents();

}

function renderSummary() {

  const invoices =
    InvoiceService.filterInvoices({

      keyword,

      roomId:
        selectedRoom,

      monthKey:
        selectedMonth,

      status:
        selectedStatus

    });

  const total =
    invoices.reduce(
      (sum, item) =>
        sum + item.total,
      0
    );

  const paid =
    invoices.reduce(
      (sum, item) =>
        sum +
        (item.paidAmount ?? 0),
      0
    );

  const debt =
    invoices.reduce(
      (sum, item) =>
        sum +
        (item.remainingDebt ?? 0),
      0
    );

  container.querySelector(
    "#invoice-summary"
  ).innerHTML = `

<div class="row mb-3">

<div class="col-md-4">

<div class="card statistics-card">

<div class="card-body">

<small>Tổng tiền</small>

<h4>${total.toLocaleString("vi-VN")} ₫</h4>

</div>

</div>

</div>

<div class="col-md-4">

<div class="card statistics-card">

<div class="card-body">

<small>Đã trả</small>

<h4>${paid.toLocaleString("vi-VN")} ₫</h4>

</div>

</div>

</div>

<div class="col-md-4">

<div class="card statistics-card">

<div class="card-body">

<small>Còn nợ</small>

<h4>${debt.toLocaleString("vi-VN")} ₫</h4>

</div>

</div>

</div>

</div>

`;

}

function renderTable() {

  const tbody =
    container.querySelector(
      "#invoice-table-body"
    );

  const invoices =
    InvoiceService.filterInvoices({

      keyword,

      roomId:
        selectedRoom,

      monthKey:
        selectedMonth,

      status:
        selectedStatus

    });

  if (!invoices.length) {

    tbody.innerHTML = `

<tr>

<td colspan="8">

<div class="empty-state">

Chưa có hóa đơn.

</div>

</td>

</tr>

`;

    return;

  }

  tbody.innerHTML =
    invoices
      .map(createRow)
      .join("");

}

function createRow(
  invoice
) {

  return `

<tr
data-testid="invoice-row">

<td>${invoice.id}</td>

<td>${invoice.roomId}</td>

<td>${invoice.monthKey}</td>

<td>${invoice.total.toLocaleString("vi-VN")} ₫</td>

<td>${invoice.paidAmount.toLocaleString("vi-VN")} ₫</td>

<td>${invoice.remainingDebt.toLocaleString("vi-VN")} ₫</td>

<td>

<span class="${getStatusBadge(invoice.status)}">

${getStatusLabel(invoice.status)}

</span>

</td>

<td>

<div class="btn-group">

<button

class="btn btn-sm btn-outline-primary detail-button"

data-id="${invoice.id}"

data-testid="invoice-detail">

Chi tiết

</button>

<button

class="btn btn-sm btn-outline-secondary edit-button"

data-id="${invoice.id}"

data-testid="invoice-edit">

Sửa

</button>

<button

class="btn btn-sm btn-outline-success finalize-button"

data-id="${invoice.id}">

Chốt

</button>

<button

class="btn btn-sm btn-outline-danger delete-button"

data-id="${invoice.id}">

Xóa

</button>

</div>

</td>

</tr>

`;

}

function getStatusBadge(status) {

  const map = {

    draft:
      "badge bg-secondary",

    unpaid:
      "badge bg-warning text-dark",

    partial:
      "badge bg-info",

    paid:
      "badge bg-success",

    overdue:
      "badge bg-danger",

    cancelled:
      "badge bg-dark"

  };

  return (
    map[status] ??
    "badge bg-secondary"
  );

}

function getStatusLabel(status) {

  const map = {

    draft: "Nháp",

    unpaid: "Chưa thanh toán",

    partial: "Thanh toán một phần",

    paid: "Đã thanh toán",

    overdue: "Quá hạn",

    cancelled: "Đã hủy"

  };

  return (
    map[status] ??
    status
  );

}

/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  container
    .querySelector("#invoice-search")
    .addEventListener(
      "input",
      handleKeywordChange
    );

  container
    .querySelector("#invoice-month")
    .addEventListener(
      "change",
      handleMonthChange
    );

  container
    .querySelector("#invoice-room")
    .addEventListener(
      "change",
      handleRoomChange
    );

  container
    .querySelector("#invoice-status")
    .addEventListener(
      "change",
      handleStatusChange
    );

  container
    .querySelector("#create-invoice-button")
    .addEventListener(
      "click",
      handleCreateInvoice
    );

  container
    .querySelector("#generate-month-button")
    .addEventListener(
      "click",
      handleGenerateInvoices
    );

  container
    .querySelector("#invoice-table-body")
    .addEventListener(
      "click",
      handleTableClick
    );

}

/**
 * Tìm kiếm.
 *
 * @param {Event} event
 */
function handleKeywordChange(
  event
) {

  keyword =
    event.target.value
      .trim();

  refreshPage();

}

/**
 * Đổi tháng.
 *
 * @param {Event} event
 */
function handleMonthChange(
  event
) {

  selectedMonth =
    event.target.value;

  refreshPage();

}

/**
 * Đổi phòng.
 *
 * @param {Event} event
 */
function handleRoomChange(
  event
) {

  selectedRoom =
    event.target.value;

  refreshPage();

}

/**
 * Đổi trạng thái.
 *
 * @param {Event} event
 */
function handleStatusChange(
  event
) {

  selectedStatus =
    event.target.value;

  refreshPage();

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
      "detail-button"
    )
  ) {

    showInvoiceDetail(
      id
    );

    return;

  }

  if (
    button.classList.contains(
      "edit-button"
    )
  ) {

    editInvoice(
      id
    );

    return;

  }

  if (
    button.classList.contains(
      "finalize-button"
    )
  ) {

    finalizeInvoice(
      id
    );

    return;

  }

  if (
    button.classList.contains(
      "delete-button"
    )
  ) {

    deleteInvoice(
      id
    );

  }

}

/**
 * Render lại.
 */
function refreshPage() {

  renderSummary();

  renderTable();

}

/**
 * Hiển thị chi tiết.
 *
 * @param {string} id
 */
function showInvoiceDetail(
  id
) {

  const invoice =
    InvoiceService.getInvoiceById(
      id
    );

  openInvoiceDetail(
    invoice
  );

}

/**
 * Mở form tạo.
 */
function handleCreateInvoice() {

  openInvoiceForm(

    {},

    (data) => {

      try {

        InvoiceService.createInvoice(
          data
        );

        showToast(
          "Đã tạo hóa đơn.",
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

  );

}

/**
 * Sinh hóa đơn hàng loạt.
 */
function handleGenerateInvoices() {

  try {

    const result =
      InvoiceService
        .generateInvoicesForMonth(
          selectedMonth
        );

    showToast(

      `Đã tạo ${result.totalCreated} hóa đơn.`,

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

/**
 * Chỉnh sửa hóa đơn nháp.
 *
 * @param {string} id
 */
function editInvoice(id) {

  const invoice =
    InvoiceService.getInvoiceById(id);

  openInvoiceForm(

    invoice,

    (data) => {

      try {

        InvoiceService.updateDraftInvoice(
          id,
          data
        );

        showToast(
          "Đã cập nhật hóa đơn.",
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

  );

}

/**
 * Chốt hóa đơn.
 *
 * @param {string} id
 */
async function finalizeInvoice(id) {

  const confirmed =
    await showConfirmDialog({

      title: "Chốt hóa đơn",

      message:
        "Sau khi chốt sẽ không thể chỉnh sửa. Tiếp tục?"

    });

  if (!confirmed) {
    return;
  }

  try {

    InvoiceService.finalizeInvoice(
      id
    );

    showToast(
      "Đã chốt hóa đơn.",
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

/**
 * Hủy hóa đơn.
 *
 * @param {string} id
 */
async function cancelInvoice(id) {

  const confirmed =
    await showConfirmDialog({

      title: "Hủy hóa đơn",

      message:
        "Bạn có chắc muốn hủy hóa đơn này?"

    });

  if (!confirmed) {
    return;
  }

  try {

    InvoiceService.cancelInvoice(
      id
    );

    showToast(
      "Đã hủy hóa đơn.",
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

/**
 * Xóa hóa đơn nháp.
 *
 * @param {string} id
 */
async function deleteInvoice(id) {

  const confirmed =
    await showConfirmDialog({

      title: "Xóa hóa đơn",

      message:
        "Bạn có chắc muốn xóa hóa đơn nháp này?"

    });

  if (!confirmed) {
    return;
  }

  try {

    InvoiceService.deleteDraftInvoice(
      id
    );

    showToast(
      "Đã xóa hóa đơn.",
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

/**
 * In hóa đơn.
 *
 * @param {string} id
 */
function printInvoice(id) {

  const invoice =
    InvoiceService.getInvoiceById(id);

  openInvoiceDetail(
    invoice,
    {
      printable: true
    }
  );

  window.print();

}