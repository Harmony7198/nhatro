export function renderDashboard(container) {
  container.innerHTML = `
    <div class="container-fluid">
      <h1 data-testid="page-title">Dashboard</h1>
      <p class="text-muted">
        Trang tổng quan hệ thống RoomMate.
      </p>
    </div>
  `;
}