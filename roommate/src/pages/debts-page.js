/**
 * @file debts-page.js
 */

import * as DebtService from "../services/debt-service.js";

let container = null;

let filters = {
  roomId: "",
  month: "",
  overdueOnly: false
};

/**
 * Render trang công nợ.
 *
 * @param {HTMLElement} element
 */
export function render(element) {

  container = element;

  renderPage();

}

function renderPage() {

  container.innerHTML = `

<div class="debts-page">

<div
class="d-flex justify-content-between align-items-center mb-4">

<h2 data-testid="debts-title">

Theo dõi công nợ

</h2>

</div>

<div class="card mb-3">

<div class="card-body">

<div class="row g-3">

<div class="col-md-4">

<select
id="filter-room"
class="form-select"
data-testid="filter-room">

<option value="">
Tất cả phòng
</option>

</select>

</div>

<div class="col-md-4">

<select
id="filter-month"
class="form-select"
data-testid="filter-month">

<option value="">
Tất cả tháng
</option>

</select>

</div>

<div class="col-md-4 d-flex align-items-center">

<div class="form-check">

<input
type="checkbox"
id="filter-overdue"
class="form-check-input"
data-testid="filter-overdue">

<label
for="filter-overdue"
class="form-check-label">

Chỉ hiển thị quá hạn

</label>

</div>

</div>

</div>

</div>

</div>

<div id="debt-summary"></div>

<div class="card">

<div class="table-responsive">

<table
class="table table-hover align-middle"
data-testid="debts-table">

<thead>

<tr>

<th>Phòng</th>

<th>Mã hóa đơn</th>

<th>Tháng</th>

<th class="text-end">

Còn nợ

</th>

<th class="text-center">

Quá hạn

</th>

<th></th>

</tr>

</thead>

<tbody
id="debts-table-body">

</tbody>

</table>

</div>

</div>

</div>

`;

  renderSummary();

  populateFilters();

  renderTable();

  registerEvents();

}

/**
 * Hiển thị thống kê.
 */
function renderSummary() {

  const totalDebt =
    DebtService.getTotalDebt();

  const outstanding =
    DebtService
      .getOutstandingInvoices()
      .length;

  const overdue =
    DebtService
      .getOverdueInvoices()
      .length;

  container.querySelector(
    "#debt-summary"
  ).innerHTML = `

<div class="row mb-3">

<div class="col-lg-4">

<div class="card debt-card">

<div class="card-body">

<small>

Tổng công nợ

</small>

<h3
data-testid="total-debt">

${totalDebt.toLocaleString("vi-VN")} ₫

</h3>

</div>

</div>

</div>

<div class="col-lg-4">

<div class="card debt-card">

<div class="card-body">

<small>

Hóa đơn còn nợ

</small>

<h3>

${outstanding}

</h3>

</div>

</div>

</div>

<div class="col-lg-4">

<div class="card debt-card">

<div class="card-body">

<small>

Hóa đơn quá hạn

</small>

<h3>

${overdue}

</h3>

</div>

</div>

</div>

</div>

`;

}

/**
 * Render danh sách công nợ.
 */
function renderTable() {

  const tbody =
    container.querySelector(
      "#debts-table-body"
    );

  let invoices =
    DebtService
      .getOutstandingInvoices();

  invoices = applyFilters(
    invoices
  );

  invoices.sort(
    (a, b) =>
      Number(b.remainingDebt ?? 0) -
      Number(a.remainingDebt ?? 0)
  );

  if (!invoices.length) {

    tbody.innerHTML = `

<tr>

<td colspan="6">

<div class="empty-state">

Không có dữ liệu công nợ.

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

/**
 * Tạo một dòng bảng.
 *
 * @param {Object} invoice
 * @returns {string}
 */
function createRow(
  invoice
) {

  const overdueDays =
    DebtService.calculateDaysOverdue(
      invoice.dueDate
    );

  const month =
    invoice.month ??
    invoice.invoiceMonth ??
    invoice.period ??
    "-";

  return `

<tr
data-testid="debt-row">

<td>

${invoice.roomId}

</td>

<td>

${invoice.code ?? invoice.id}

</td>

<td>

${month}

</td>

<td class="text-end">

${Number(
  invoice.remainingDebt ?? 0
).toLocaleString("vi-VN")} ₫

</td>

<td class="text-center">

${renderOverdueBadge(
  overdueDays
)}

</td>

<td>

<a

href="#/invoices/${invoice.id}"

class="btn btn-sm btn-outline-primary"

data-testid="view-invoice">

Xem chi tiết

</a>

</td>

</tr>

`;

}

/**
 * Badge quá hạn.
 *
 * @param {number} days
 * @returns {string}
 */
function renderOverdueBadge(
  days
) {

  if (days <= 0) {

    return `

<span
class="badge bg-success">

Đúng hạn

</span>

`;

  }

  return `

<span
class="badge bg-danger">

${days} ngày

</span>

`;

}

/**
 * Áp dụng bộ lọc.
 *
 * @param {Array} invoices
 * @returns {Array}
 */
function applyFilters(
  invoices
) {

  return invoices.filter(
    invoice => {

      if (
        filters.roomId &&
        invoice.roomId !==
          filters.roomId
      ) {
        return false;
      }

      const month =
        invoice.month ??
        invoice.invoiceMonth ??
        invoice.period ??
        "";

      if (
        filters.month &&
        month !==
          filters.month
      ) {
        return false;
      }

      if (
        filters.overdueOnly &&
        DebtService.calculateDaysOverdue(
          invoice.dueDate
        ) <= 0
      ) {
        return false;
      }

      return true;

    }
  );

}

/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  container
    .querySelector("#filter-room")
    .addEventListener(
      "change",
      handleFilterChange
    );

  container
    .querySelector("#filter-month")
    .addEventListener(
      "change",
      handleFilterChange
    );

  container
    .querySelector("#filter-overdue")
    .addEventListener(
      "change",
      handleFilterChange
    );

}

/**
 * Xử lý thay đổi bộ lọc.
 */
function handleFilterChange() {

  filters.roomId =
    container.querySelector(
      "#filter-room"
    ).value;

  filters.month =
    container.querySelector(
      "#filter-month"
    ).value;

  filters.overdueOnly =
    container.querySelector(
      "#filter-overdue"
    ).checked;

  refreshPage();

}

/**
 * Nạp dữ liệu cho bộ lọc.
 */
function populateFilters() {

  populateRoomFilter();

  populateMonthFilter();

}

/**
 * Nạp danh sách phòng.
 */
function populateRoomFilter() {

  const select =
    container.querySelector(
      "#filter-room"
    );

  const roomIds =
    [
      ...new Set(

        DebtService
          .getOutstandingInvoices()

          .map(
            invoice =>
              invoice.roomId
          )

          .filter(Boolean)

      )
    ]
    .sort();

  select.innerHTML = `

<option value="">
Tất cả phòng
</option>

`;

  roomIds.forEach(
    roomId => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        roomId;

      option.textContent =
        roomId;

      select.appendChild(
        option
      );

    });

  select.value =
    filters.roomId;

}

/**
 * Nạp danh sách tháng.
 */
function populateMonthFilter() {

  const select =
    container.querySelector(
      "#filter-month"
    );

  const months =
    [
      ...new Set(

        DebtService
          .getOutstandingInvoices()

          .map(invoice =>

            invoice.month ??

            invoice.invoiceMonth ??

            invoice.period

          )

          .filter(Boolean)

      )
    ]
    .sort()
    .reverse();

  select.innerHTML = `

<option value="">
Tất cả tháng
</option>

`;

  months.forEach(
    month => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        month;

      option.textContent =
        month;

      select.appendChild(
        option
      );

    });

  select.value =
    filters.month;

}

/**
 * Làm mới dữ liệu.
 */
function refreshPage() {

  renderSummary();

  renderTable();

}

/**
 * Khởi tạo các sự kiện toàn cục.
 * Gọi sau khi render nếu router của bạn
 * không tự hủy page cũ.
 */
export function mount() {

  window.addEventListener(
    "invoice-payment-updated",
    handleInvoiceUpdated
  );

  window.addEventListener(
    "storage",
    handleStorageChanged
  );

}

/**
 * Hủy sự kiện khi rời trang.
 */
export function unmount() {

  window.removeEventListener(
    "invoice-payment-updated",
    handleInvoiceUpdated
  );

  window.removeEventListener(
    "storage",
    handleStorageChanged
  );

}

/**
 * Khi công nợ thay đổi
 * sau khi thanh toán.
 */
function handleInvoiceUpdated() {

  refreshPage();

  populateFilters();

}

/**
 * Đồng bộ nếu dữ liệu thay đổi
 * từ tab khác.
 */
function handleStorageChanged() {

  refreshPage();

  populateFilters();

}

/**
 * Điều hướng xem chi tiết hóa đơn.
 *
 * @param {string} invoiceId
 */
export function goToInvoiceDetail(
  invoiceId
) {

  if (!invoiceId) {
    return;
  }

  window.location.hash =
    `#/invoices/${invoiceId}`;

}

/**
 * Trả về trạng thái badge.
 *
 * @param {Object} invoice
 * @returns {string}
 */
function getDebtStatusBadge(
  invoice
) {

  const overdueDays =
    DebtService.calculateDaysOverdue(
      invoice.dueDate
    );

  if (overdueDays > 0) {

    return `
<span class="badge bg-danger">
Quá hạn
</span>
`;

  }

  if (
    Number(invoice.remainingDebt) > 0
  ) {

    return `
<span class="badge bg-warning text-dark">
Còn nợ
</span>
`;

  }

  return `
<span class="badge bg-success">
Đã thanh toán
</span>
`;

}

/**
 * Format tiền VNĐ.
 *
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(
  value
) {

  return Number(value ?? 0)
    .toLocaleString(
      "vi-VN"
    ) + " ₫";

}

/**
 * Format tháng.
 *
 * @param {string} month
 * @returns {string}
 */
function formatMonth(
  month
) {

  if (!month) {
    return "-";
  }

  return month;

}

/**
 * Format số ngày quá hạn.
 *
 * @param {number} days
 * @returns {string}
 */
function formatOverdueDays(
  days
) {

  if (days <= 0) {
    return "-";
  }

  return `${days} ngày`;

}