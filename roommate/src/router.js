const routes = new Map();

/**
 * Đăng ký một route
 * @param {string} path
 * @param {Function} render
 */
export function registerRoute(path, render) {
  routes.set(path, render);
}

/**
 * Lấy hash hiện tại
 */
function getCurrentRoute() {
  const hash = window.location.hash || "#/dashboard";
  return hash.replace(/^#/, "");
}

/**
 * Đánh dấu menu đang active
 */
function updateActiveMenu(path) {
  document.querySelectorAll("[data-page]").forEach((item) => {
    const page = item.dataset.page;
    const route = `/${page}`;

    item.classList.toggle("active", route === path);
  });
}

/**
 * Render route
 */
export function navigate() {
  const outlet = document.querySelector("#page-content");

  if (!outlet) {
    console.error("Router: Không tìm thấy #page-content");
    return;
  }

  const path = getCurrentRoute();

  updateActiveMenu(path);

  const render = routes.get(path);

  outlet.innerHTML = "";

  if (render) {
    render(outlet);
    return;
  }

  const notFound = routes.get("/404");

  if (notFound) {
    notFound(outlet);
    return;
  }

  outlet.innerHTML = `
    <div class="container py-5 text-center">
      <h2>404</h2>
      <p>Không tìm thấy trang.</p>
    </div>
  `;
}

/**
 * Khởi tạo router
 */
export function initializeRouter() {
  if (!window.location.hash) {
    window.location.hash = "#/dashboard";
  }

  window.addEventListener("hashchange", navigate);

  navigate();
}