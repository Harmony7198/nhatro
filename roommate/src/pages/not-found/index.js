export function renderNotFound(container) {
  container.innerHTML = `
    <div class="container py-5 text-center">

      <h1 class="display-5">404</h1>

      <p class="text-muted">
        Không tìm thấy trang bạn yêu cầu.
      </p>

      <a
        href="#/dashboard"
        class="btn btn-primary"
        data-testid="go-dashboard">

        Quay về Dashboard

      </a>

    </div>
  `;
}