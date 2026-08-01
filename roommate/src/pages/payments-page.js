/**
 * @file payments-page.js
 */

import * as PaymentService from "../services/payment-service.js";
import { openPaymentForm } from "../components/payment-form.js";
import { showToast } from "../components/toast.js";
import { showConfirmDialog } from "../components/confirm-dialog.js";

let container = null;

let filters = {
  fromDate: "",
  toDate: "",
  method: "",
  roomId: ""
};

/**
 * Render trang.
 *
 * @param {HTMLElement} element
 */
export function render(element) {

  container = element;

  renderPage();

}

function renderPage() {

  container.innerHTML = `

<div class="payments-page">

<div class="d-flex justify-content-between align-items-center mb-4">

<h2 data-testid="payments-title">
Quản lý thanh toán
</h2>

<button
class="btn btn-primary"
id="create-payment-button"
data-testid="create-payment">

Thêm thanh toán

</button>

</div>

<div class="card mb-3">

<div class="card-body">

<div class="row g-3">

<div class="col-md-3">

<input
type="date"
id="filter-from-date"
class="form-control"
data-testid="filter-from-date">

</div>

<div class="col-md-3">

<input
type="date"
id="filter-to-date"
class="form-control"
data-testid="filter-to-date">

</div>

<div class="col-md-3">

<select
id="filter-method"
class="form-select"
data-testid="filter-method">

<option value="">
Tất cả phương thức
</option>

<option value="cash">
Tiền mặt
</option>

<option value="bank">
Chuyển khoản
</option>

<option value="ewallet">
Ví điện tử
</option>

</select>

</div>

<div class="col-md-3">

<select
id="filter-room"
class="form-select"
data-testid="filter-room">

<option value="">
Tất cả phòng
</option>

</select>

</div>

</div>

</div>

</div>

<div id="payments-summary"></div>

<div class="card">

<div class="table-responsive">

<table
class="table table-hover align-middle"
data-testid="payments-table">

<thead>

<tr>

<th>Mã GD</th>

<th>Hóa đơn</th>

<th>Phòng</th>

<th>Ngày</th>

<th>Phương thức</th>

<th class="text-end">
Số tiền
</th>

<th></th>

</tr>

</thead>

<tbody id="payments-table-body">

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

  const payments =
    PaymentService.filterPayments(filters);

  const total =
    payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );

  container.querySelector(
    "#payments-summary"
  ).innerHTML = `

<div class="row mb-3">

<div class="col-md-4">

<div class="card statistics-card">

<div class="card-body">

<small>

Số giao dịch

</small>

<h4>

${payments.length}

</h4>

</div>

</div>

</div>

<div class="col-md-4">

<div class="card statistics-card">

<div class="card-body">

<small>

Tổng tiền đã thu

</small>

<h4>

${total.toLocaleString("vi-VN")} ₫

</h4>

</div>

</div>

</div>

<div class="col-md-4">

<div class="card statistics-card">

<div class="card-body">

<small>

Phương thức

</small>

<h4>

${filters.method || "Tất cả"}

</h4>

</div>

</div>

</div>

</div>

`;

}

function renderTable() {

  const tbody =
    container.querySelector(
      "#payments-table-body"
    );

  const payments =
    PaymentService.filterPayments(
      filters
    );

  if (!payments.length) {

    tbody.innerHTML = `

<tr>

<td colspan="7">

<div class="empty-state">

Chưa có giao dịch thanh toán.

</div>

</td>

</tr>

`;

    return;

  }

  tbody.innerHTML =
    payments
      .map(createRow)
      .join("");

}

function createRow(payment) {

  return `

<tr data-testid="payment-row">

<td>

${payment.id}

</td>

<td>

${payment.invoiceId}

</td>

<td>

${payment.roomId ?? "-"}

</td>

<td>

${new Date(payment.paymentDate)
  .toLocaleDateString("vi-VN")}

</td>

<td>

${getMethodLabel(
  payment.method
)}

</td>

<td class="text-end">

${Number(payment.amount)
  .toLocaleString("vi-VN")} ₫

</td>

<td>

<button

class="btn btn-sm btn-outline-danger delete-payment-button"

data-id="${payment.id}"

data-testid="delete-payment">

Xóa

</button>

</td>

</tr>

`;

}

function getMethodLabel(method) {

  const map = {

    cash: "Tiền mặt",

    bank: "Chuyển khoản",

    ewallet: "Ví điện tử"

  };

  return map[method] ?? method;

}

/**
 * Đăng ký sự kiện.
 */
function registerEvents() {

  container
    .querySelector(
      "#create-payment-button"
    )
    .addEventListener(
      "click",
      handleCreatePayment
    );

  container
    .querySelector(
      "#filter-from-date"
    )
    .addEventListener(
      "change",
      handleFilterChange
    );

  container
    .querySelector(
      "#filter-to-date"
    )
    .addEventListener(
      "change",
      handleFilterChange
    );

  container
    .querySelector(
      "#filter-method"
    )
    .addEventListener(
      "change",
      handleFilterChange
    );

  container
    .querySelector(
      "#filter-room"
    )
    .addEventListener(
      "change",
      handleFilterChange
    );

  container
    .querySelector(
      "#payments-table-body"
    )
    .addEventListener(
      "click",
      handleTableClick
    );

  populateRoomFilter();

}

/**
 * Xử lý thay đổi bộ lọc.
 */
function handleFilterChange() {

  filters.fromDate =
    container.querySelector(
      "#filter-from-date"
    ).value;

  filters.toDate =
    container.querySelector(
      "#filter-to-date"
    ).value;

  filters.method =
    container.querySelector(
      "#filter-method"
    ).value;

  filters.roomId =
    container.querySelector(
      "#filter-room"
    ).value;

  refreshPage();

}

/**
 * Xử lý click trên bảng.
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

  if (
    button.classList.contains(
      "delete-payment-button"
    )
  ) {

    deletePayment(
      id
    );

  }

}

/**
 * Làm mới dữ liệu.
 */
function refreshPage() {

  renderSummary();

  renderTable();

}

/**
 * Nạp danh sách phòng
 * vào bộ lọc.
 */
function populateRoomFilter() {

  const select =
    container.querySelector(
      "#filter-room"
    );

  const payments =
    PaymentService.getPayments();

  const roomIds =
    [
      ...new Set(
        payments
          .map(
            payment =>
              payment.roomId
          )
          .filter(Boolean)
      )
    ];

  select.innerHTML = `

<option value="">
Tất cả phòng
</option>

`;

  roomIds
    .sort()
    .forEach(roomId => {

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
 * Xử lý tạo thanh toán.
 */
function handleCreatePayment() {

  openPaymentForm(
    null,
    () => {

      refreshPage();

      populateRoomFilter();

    }
  );

}

/**
 * Xóa giao dịch thanh toán.
 *
 * @param {string} paymentId
 */
async function deletePayment(
  paymentId
) {

  if (!paymentId) {
    return;
  }

  const confirmed =
    await showConfirmDialog({

      title:
        "Xóa giao dịch",

      message:
        "Bạn có chắc muốn xóa giao dịch thanh toán này không?",

      confirmText:
        "Xóa",

      cancelText:
        "Hủy"

    });

  if (!confirmed) {
    return;
  }

  try {

    const payment =
      PaymentService.getPaymentById(
        paymentId
      );

    const invoiceId =
      payment.invoiceId;

    PaymentService.deletePayment(
      paymentId
    );

    refreshAfterPaymentChange(
      invoiceId
    );

    showToast({
      type: "success",
      message:
        "Đã xóa giao dịch thanh toán."
    });

  } catch (error) {

    console.error(error);

    showToast({
      type: "danger",
      message:
        error.message ??
        "Không thể xóa giao dịch."
    });

  }

}

/**
 * Làm mới sau khi thay đổi thanh toán.
 *
 * @param {string} invoiceId
 */
function refreshAfterPaymentChange(
  invoiceId
) {

  refreshPage();

  populateRoomFilter();

  updateInvoiceSummary(
    invoiceId
  );

}

/**
 * Cập nhật thông tin công nợ
 * của hóa đơn sau khi thanh toán.
 *
 * @param {string} invoiceId
 */
function updateInvoiceSummary(
  invoiceId
) {

  if (!invoiceId) {
    return;
  }

  /*
   * PaymentService đã đồng bộ
   * InvoiceService trong lúc
   * create/delete payment.
   *
   * Chỉ cần phát sự kiện để
   * các component khác render lại.
   */

  window.dispatchEvent(

    new CustomEvent(
      "invoice-payment-updated",
      {
        detail: {
          invoiceId
        }
      }
    )

  );

}

/**
 * Hiển thị lỗi.
 *
 * @param {Error} error
 */
function handleError(
  error
) {

  console.error(
    error
  );

  showToast({

    type:
      "danger",

    message:
      error?.message ??
      "Đã xảy ra lỗi."

  });

}

