export function renderRooms(container) {
  container.innerHTML = `
    <div class="container-fluid">
      <h1 data-testid="page-title">Quản lý phòng</h1>
      <p class="text-muted">
        Trang này sẽ hiển thị danh sách phòng.
      </p>
    </div>
  `;
}