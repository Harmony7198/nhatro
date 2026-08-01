/**
 * @file payment-form.js
 */

import * as PaymentService from "../services/payment-service.js";
import * as InvoiceService from "../services/invoice-service.js";

let modalElement = null;
let submitCallback = null;

/**
 * Mở form thanh toán.
 *
 * @param {Object|null} payment
 * @param {Function} onSuccess
 */
export function openPaymentForm(
  payment = null,
  onSuccess
) {

  submitCallback =
    onSuccess;

  createModal();

  populateInvoiceOptions();

  resetForm();

  modalElement.style.display =
    "block";

}

/**
 * Tạo modal.
 */
function createModal() {

  if (modalElement) {

    return;

  }

  modalElement =
    document.createElement(
      "div"
    );

  modalElement.className =
    "payment-modal";

  modalElement.innerHTML = `

<div class="payment-modal-content">

<h3
data-testid="payment-form-title">

Thanh toán hóa đơn

</h3>

<div class="mb-3">

<label class="form-label">

Hóa đơn

</label>

<select
id="payment-invoice"
class="form-select"
data-testid="payment-invoice">

</select>

</div>

<div
class="row mb-3">

<div class="col-md-4">

<label class="form-label">

Tổng hóa đơn

</label>

<input
id="invoice-total"
class="form-control"
readonly>

</div>

<div class="col-md-4">

<label class="form-label">

Đã thanh toán

</label>

<input
id="invoice-paid"
class="form-control"
readonly>

</div>

<div class="col-md-4">

<label class="form-label">

Còn nợ

</label>

<input
id="invoice-remaining"
class="form-control"
readonly>

</div>

</div>

<div class="mb-3">

<label class="form-label">

Số tiền thanh toán

</label>

<input
type="number"
min="1"
step="1000"
id="payment-amount"
class="form-control"
data-testid="payment-amount">

<div
id="payment-amount-error"
class="text-danger small mt-1">

</div>

</div>

<div class="mb-3">

<label class="form-label">

Phương thức

</label>

<select
id="payment-method"
class="form-select"
data-testid="payment-method">

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

<div class="mb-3">

<label class="form-label">

Ngày thanh toán

</label>

<input
type="date"
id="payment-date"
class="form-control"
data-testid="payment-date">

</div>

<div class="mb-3">

<label class="form-label">

Ghi chú

</label>

<textarea
id="payment-note"
class="form-control"
rows="3">

</textarea>

</div>

<div
id="payment-form-errors"
class="text-danger mb-3">

</div>

<div
class="d-flex justify-content-end gap-2">

<button
class="btn btn-secondary"
id="payment-cancel">

Đóng

</button>

<button
class="btn btn-primary"
id="payment-save"
data-testid="payment-save">

Thanh toán

</button>

</div>

</div>

`;

  document.body.appendChild(
    modalElement
  );

  bindEvents();

}

/**
 * Đăng ký sự kiện.
 */
function bindEvents() {

  modalElement
    .querySelector("#payment-cancel")
    .addEventListener(
      "click",
      closeForm
    );

  modalElement
    .querySelector("#payment-save")
    .addEventListener(
      "click",
      handleSubmit
    );

  modalElement
    .querySelector("#payment-invoice")
    .addEventListener(
      "change",
      handleInvoiceChange
    );

  modalElement
    .querySelector("#payment-amount")
    .addEventListener(
      "input",
      validateAmount
    );

}

/**
 * Đóng form.
 */
function closeForm() {

  modalElement.style.display =
    "none";

}

/**
 * Reset form.
 */
function resetForm() {

  modalElement.querySelector(
    "#payment-date"
  ).value =
    new Date()
      .toISOString()
      .split("T")[0];

  modalElement.querySelector(
    "#payment-amount"
  ).value = "";

  modalElement.querySelector(
    "#payment-note"
  ).value = "";

}

/**
 * Chỉ hiển thị các hóa đơn
 * còn nợ.
 */
function populateInvoiceOptions() {

  const select =
    modalElement.querySelector(
      "#payment-invoice"
    );

  const invoices =
    InvoiceService
      .filterInvoices({
        status: [
          "unpaid",
          "partial",
          "overdue"
        ]
      });

  select.innerHTML = "";

  invoices.forEach(
    invoice => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        invoice.id;

      option.textContent =
        `${invoice.code ?? invoice.id} - ${invoice.roomId}`;

      select.appendChild(
        option
      );

    });

  if (
    invoices.length
  ) {

    updateInvoiceInfo(
      invoices[0].id
    );

  }

}

/**
 * Khi đổi hóa đơn.
 */
function handleInvoiceChange(
  event
) {

  updateInvoiceInfo(
    event.target.value
  );

}

/**
 * Hiển thị thông tin hóa đơn.
 */
function updateInvoiceInfo(
  invoiceId
) {

  if (!invoiceId) {
    return;
  }

  const invoice =
    InvoiceService
      .getInvoiceById(
        invoiceId
      );

  modalElement.querySelector(
    "#invoice-total"
  ).value =
    Number(invoice.total)
      .toLocaleString("vi-VN");

  modalElement.querySelector(
    "#invoice-paid"
  ).value =
    Number(invoice.paidAmount ?? 0)
      .toLocaleString("vi-VN");

  modalElement.querySelector(
    "#invoice-remaining"
  ).value =
    Number(invoice.remainingDebt ?? 0)
      .toLocaleString("vi-VN");

  validateAmount();

}

/**
 * Không cho nhập vượt công nợ.
 */
function validateAmount() {

  const invoice =
    InvoiceService
      .getInvoiceById(

        modalElement.querySelector(
          "#payment-invoice"
        ).value

      );

  const input =
    modalElement.querySelector(
      "#payment-amount"
    );

  const error =
    modalElement.querySelector(
      "#payment-amount-error"
    );

  const amount =
    Number(input.value || 0);

  if (
    amount >
    Number(
      invoice.remainingDebt
    )
  ) {

    error.textContent =
      "Số tiền vượt công nợ.";

    return false;

  }

  if (
    amount <= 0 &&
    input.value !== ""
  ) {

    error.textContent =
      "Số tiền phải lớn hơn 0.";

    return false;

  }

  error.textContent = "";

  return true;

}

/**
 * Lưu thanh toán.
 */
function handleSubmit() {

  if (!validateAmount()) {
    return;
  }

  const data = {

    invoiceId:
      modalElement.querySelector(
        "#payment-invoice"
      ).value,

    amount:
      Number(
        modalElement.querySelector(
          "#payment-amount"
        ).value
      ),

    method:
      modalElement.querySelector(
        "#payment-method"
      ).value,

    paymentDate:
      modalElement.querySelector(
        "#payment-date"
      ).value,

    note:
      modalElement.querySelector(
        "#payment-note"
      ).value

  };

  try {

    const payment =
      PaymentService.createPayment(
        data
      );

    closeForm();

    if (
      typeof submitCallback ===
      "function"
    ) {

      submitCallback(
        payment
      );

    }

  } catch (error) {

    modalElement.querySelector(
      "#payment-form-errors"
    ).textContent =
      error.message;

  }

}