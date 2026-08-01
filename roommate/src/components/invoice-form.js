/**
 * @file invoice-form.js
 * @description Form tạo và chỉnh sửa hóa đơn.
 */

let modalElement = null;


/**
 * Mở form hóa đơn.
 *
 * @param {Object} invoice
 * @param {Function} onSubmit
 */
export function openInvoiceForm(
  invoice = {},
  onSubmit
) {

  createModal();

  fillForm(
    invoice
  );

  modalElement
    .querySelector(
      "#invoice-form-submit"
    )
    .onclick = () => {

      const data =
        getFormData();

      const errors =
        validateForm(
          data
        );

      if (errors.length) {

        showErrors(
          errors
        );

        return;

      }

      onSubmit(
        data
      );

      closeModal();

    };

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
    "invoice-modal";


  modalElement.innerHTML = `

<div class="invoice-modal-content">


<h3 data-testid="invoice-form-title">
Hóa đơn
</h3>


<div class="mb-3">

<label>
Phòng
</label>

<input

id="invoice-room-id"

class="form-control"

readonly

data-testid="invoice-room-input">

</div>



<div class="mb-3">

<label>
Tháng
</label>

<input

id="invoice-month-key"

type="month"

class="form-control"

readonly

data-testid="invoice-month-input">

</div>



<div class="mb-3">

<label>
Hạn thanh toán
</label>

<input

id="invoice-due-date"

type="date"

class="form-control"

data-testid="invoice-due-date">

</div>



<div class="mb-3">

<label>
Giảm giá
</label>

<input

id="invoice-discount"

type="number"

min="0"

class="form-control"

value="0"

data-testid="invoice-discount">

</div>



<div class="mb-3">

<label>
Ghi chú
</label>

<textarea

id="invoice-note"

class="form-control"

data-testid="invoice-note">

</textarea>

</div>



<div

id="invoice-form-errors"

class="text-danger">

</div>



<button

class="btn btn-primary"

id="invoice-form-submit"

data-testid="invoice-submit">

Lưu

</button>


<button

class="btn btn-secondary"

id="invoice-form-close">

Đóng

</button>


</div>

`;


  document.body.appendChild(
    modalElement
  );


  modalElement
    .querySelector(
      "#invoice-form-close"
    )
    .onclick =
    closeModal;

}


/**
 * Điền dữ liệu.
 *
 * @param {Object} invoice
 */
function fillForm(
  invoice
) {

  modalElement
    .querySelector(
      "#invoice-room-id"
    )
    .value =
    invoice.roomId ?? "";


  modalElement
    .querySelector(
      "#invoice-month-key"
    )
    .value =
    invoice.monthKey ?? "";


  modalElement
    .querySelector(
      "#invoice-due-date"
    )
    .value =
    invoice.dueDate
      ?
      invoice.dueDate.slice(
        0,
        10
      )
      :
      "";


  modalElement
    .querySelector(
      "#invoice-discount"
    )
    .value =
    invoice.discount ?? 0;


  modalElement
    .querySelector(
      "#invoice-note"
    )
    .value =
    invoice.note ?? "";

}


/**
 * Lấy dữ liệu form.
 *
 * @returns {Object}
 */
function getFormData() {

  return {

    dueDate:
      modalElement
        .querySelector(
          "#invoice-due-date"
        )
        .value,


    discount:
      Number(
        modalElement
          .querySelector(
            "#invoice-discount"
          )
          .value
      ),


    note:
      modalElement
        .querySelector(
          "#invoice-note"
        )
        .value
        .trim()

  };

}


/**
 * Kiểm tra form.
 *
 * @param {Object} data
 * @returns {Array}
 */
function validateForm(
  data
) {

  const errors = [];


  if (
    !data.dueDate
  ) {

    errors.push(
      "Hạn thanh toán bắt buộc."
    );

  }


  if (
    Number.isNaN(
      data.discount
    )
  ) {

    errors.push(
      "Giảm giá không hợp lệ."
    );

  }


  if (
    data.discount < 0
  ) {

    errors.push(
      "Giảm giá không được âm."
    );

  }


  return errors;

}


/**
 * Hiển thị lỗi.
 *
 * @param {Array} errors
 */
function showErrors(
  errors
) {

  modalElement
    .querySelector(
      "#invoice-form-errors"
    )
    .innerHTML =

    errors
      .map(
        error =>
          `<div>${error}</div>`
      )
      .join("");

}


/**
 * Đóng modal.
 */
function closeModal() {

  if (!modalElement) {
    return;
  }


  modalElement.style.display =
    "none";

}