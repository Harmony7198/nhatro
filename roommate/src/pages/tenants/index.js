export function renderTenants(container) {
  container.innerHTML = `
    <div class="container-fluid">
      <h1 data-testid="page-title">Quản lý người thuê</h1>
      <p class="text-muted">
        Trang này sẽ hiển thị danh sách người thuê.
      </p>
    </div>
  `;
}