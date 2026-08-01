export function initializeConfirmDialog() {

  const modal = document.createElement("div");

  modal.className = "modal fade";

  modal.id = "confirmDialog";

  modal.tabIndex = -1;

  modal.setAttribute("aria-hidden", "true");

  modal.setAttribute("data-testid", "confirm-dialog");

  modal.innerHTML = `
<div class="modal-dialog">

<div class="modal-content">

<div class="modal-header">

<h5 class="modal-title">
Xác nhận
</h5>

<button
class="btn-close"
data-bs-dismiss="modal">
</button>

</div>

<div class="modal-body">

<p id="confirm-dialog-message">
Bạn có chắc chắn muốn thực hiện thao tác này?
</p>

</div>

<div class="modal-footer">

<button
type="button"
class="btn btn-secondary"
data-bs-dismiss="modal"
data-testid="confirm-cancel">

Hủy

</button>

<button
type="button"
class="btn btn-danger"
id="confirm-dialog-ok"
data-testid="confirm-ok">

Xóa

</button>

</div>

</div>

</div>
`;

  document.body.appendChild(modal);
}