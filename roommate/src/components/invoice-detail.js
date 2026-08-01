/**
 * @file invoice-detail.js
 * @description Hiển thị chi tiết hóa đơn.
 */

let modalElement = null;

/**
 * Mở cửa sổ chi tiết hóa đơn.
 *
 * @param {Object} invoice
 * @param {Object} options
 */
export function openInvoiceDetail(
  invoice,
  options = {}
) {

  if (!invoice) {
    throw new Error(
      "Hóa đơn không tồn tại."
    );
  }

  createModal();

  renderInvoice(
    invoice
  );

  if (
    options.printable
  ) {

    modalElement.classList.add(
      "print-mode"
    );

  } else {

    modalElement.classList.remove(
      "print-mode"
    );

  }

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
    "invoice-detail-modal";

  modalElement.innerHTML = `

<div class="invoice-detail-content">

<div class="d-flex justify-content-between align-items-center mb-3">

<h3 data-testid="invoice-detail-title">

Chi tiết hóa đơn

</h3>

<div>

<button

class="btn btn-outline-primary"

id="invoice-detail-print"

data-testid="invoice-detail-print">

In

</button>

<button

class="btn btn-secondary"

id="invoice-detail-close">

Đóng

</button>

</div>

</div>

<div id="invoice-detail-body">

</div>

</div>

`;

  document.body.appendChild(
    modalElement
  );

  modalElement
    .querySelector(
      "#invoice-detail-close"
    )
    .onclick =
    closeModal;

  modalElement
    .querySelector(
      "#invoice-detail-print"
    )
    .onclick = () => {

      window.print();

    };

}

/**
 * Render hóa đơn.
 *
 * @param {Object} invoice
 */
function renderInvoice(
  invoice
) {

  const tbody =
    invoice.items
      .map(item => {

        return `

<tr>

<td>${item.name}</td>

<td class="text-end">

${Number(item.quantity).toLocaleString("vi-VN")}

</td>

<td class="text-end">

${Number(item.unitPrice).toLocaleString("vi-VN")} ₫

</td>

<td class="text-end">

${Number(item.amount).toLocaleString("vi-VN")} ₫

</td>

</tr>

`;

      })
      .join("");

  modalElement
    .querySelector(
      "#invoice-detail-body"
    )
    .innerHTML = `

<div class="row mb-3">

<div class="col-md-6">

<strong>Mã hóa đơn</strong><br>

${invoice.id}

</div>

<div class="col-md-6">

<strong>Phòng</strong><br>

${invoice.roomId}

</div>

</div>

<div class="row mb-4">

<div class="col-md-4">

<strong>Tháng</strong><br>

${invoice.monthKey}

</div>

<div class="col-md-4">

<strong>Ngày lập</strong><br>

${formatDate(invoice.issueDate)}

</div>

<div class="col-md-4">

<strong>Hạn thanh toán</strong><br>

${formatDate(invoice.dueDate)}

</div>

</div>

<table
class="table table-bordered"
data-testid="invoice-items-table">

<thead>

<tr>

<th>Dịch vụ</th>

<th class="text-end">

Số lượng

</th>

<th class="text-end">

Đơn giá

</th>

<th class="text-end">

Thành tiền

</th>

</tr>

</thead>

<tbody>

${tbody}

</tbody>

<tfoot>

<tr>

<th colspan="3">

Tạm tính

</th>

<th class="text-end">

${Number(invoice.subtotal).toLocaleString("vi-VN")} ₫

</th>

</tr>

<tr>

<th colspan="3">

Giảm giá

</th>

<th class="text-end">

${Number(invoice.discount).toLocaleString("vi-VN")} ₫

</th>

</tr>

<tr>

<th colspan="3">

Tổng tiền

</th>

<th class="text-end">

${Number(invoice.total).toLocaleString("vi-VN")} ₫

</th>

</tr>

<tr>

<th colspan="3">

Đã thanh toán

</th>

<th class="text-end">

${Number(invoice.paidAmount).toLocaleString("vi-VN")} ₫

</th>

</tr>

<tr>

<th colspan="3">

Còn nợ

</th>

<th class="text-end">

${Number(invoice.remainingDebt).toLocaleString("vi-VN")} ₫

</th>

</tr>

</tfoot>

</table>

<div class="mt-3">

<strong>Trạng thái:</strong>

<span class="${getStatusBadge(invoice.status)}">

${getStatusLabel(invoice.status)}

</span>

</div>

${invoice.note
? `
<div class="mt-3">

<strong>Ghi chú</strong>

<div class="border rounded p-3">

${invoice.note}

</div>

</div>
`
: ""}

`;

}

/**
 * Format ngày.
 *
 * @param {string} value
 * @returns {string}
 */
function formatDate(
  value
) {

  if (!value) {
    return "";
  }

  return new Date(value)
    .toLocaleDateString(
      "vi-VN"
    );

}

function getStatusBadge(
  status
) {

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

function getStatusLabel(
  status
) {

  const map = {

    draft:
      "Nháp",

    unpaid:
      "Chưa thanh toán",

    partial:
      "Thanh toán một phần",

    paid:
      "Đã thanh toán",

    overdue:
      "Quá hạn",

    cancelled:
      "Đã hủy"

  };

  return (
    map[status] ??
    status
  );

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