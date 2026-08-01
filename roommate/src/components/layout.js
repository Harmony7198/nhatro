const menus = [
  { page: "dashboard", title: "Dashboard", icon: "speedometer2" },
  { page: "rooms", title: "Phòng", icon: "door-open" },
  { page: "tenants", title: "Người thuê", icon: "people" },
  { page: "contracts", title: "Hợp đồng", icon: "file-earmark-text" },
  { page: "meters", title: "Điện nước", icon: "lightning-charge" },
  { page: "services", title: "Dịch vụ", icon: "gear" },
  { page: "invoices", title: "Hóa đơn", icon: "receipt" },
  { page: "payments", title: "Thanh toán", icon: "cash-stack" },
  { page: "debts", title: "Công nợ", icon: "exclamation-circle" },
  { page: "reports", title: "Báo cáo", icon: "bar-chart" },
  { page: "settings", title: "Cài đặt", icon: "sliders" }
];

function createMenuItem(menu, mobile = false) {
  const link = document.createElement("a");

  link.href = `#/${menu.page}`;
  link.className = "nav-link rounded mb-1";

  link.dataset.page = menu.page;
  link.dataset.testid = `${mobile ? "mobile-" : ""}menu-${menu.page}`;

  if (mobile) {
    link.setAttribute("data-bs-dismiss", "offcanvas");
  }

  link.innerHTML = `
    <i class="bi bi-${menu.icon} me-2"></i>
    ${menu.title}
  `;

  return link;
}

function createSidebar() {
  const aside = document.createElement("aside");

  aside.className =
    "rm-sidebar bg-dark text-white d-none d-lg-flex flex-column";

  aside.setAttribute("data-testid", "sidebar");

  const brand = document.createElement("div");

  brand.className = "p-3 border-bottom";

  brand.innerHTML = `
    <div class="rm-brand">
      <i class="bi bi-house-door-fill me-2"></i>
      RoomMate
    </div>
  `;

  aside.appendChild(brand);

  const nav = document.createElement("nav");

  nav.className = "nav flex-column p-2 rm-menu";

  menus.forEach((menu) => {
    nav.appendChild(createMenuItem(menu));
  });

  aside.appendChild(nav);

  return aside;
}

function createMobileMenu() {
  const offcanvas = document.createElement("div");

  offcanvas.className = "offcanvas offcanvas-start";
  offcanvas.id = "mobileMenu";
  offcanvas.tabIndex = -1;

  offcanvas.setAttribute("data-testid", "mobile-menu");

  offcanvas.innerHTML = `
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">RoomMate</h5>

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close">
      </button>
    </div>
  `;

  const body = document.createElement("div");
  body.className = "offcanvas-body";

  const nav = document.createElement("nav");
  nav.className = "nav flex-column";

  menus.forEach((menu) => {
    nav.appendChild(createMenuItem(menu, true));
  });

  body.appendChild(nav);

  offcanvas.appendChild(body);

  return offcanvas;
}

function createHeader() {
  const header = document.createElement("header");

  header.className =
    "navbar navbar-expand-lg bg-white border-bottom";

  header.setAttribute("data-testid", "topbar");

  header.innerHTML = `
    <div class="container-fluid">

      <button
        class="btn btn-outline-secondary d-lg-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileMenu"
        data-testid="mobile-menu-button">

        <i class="bi bi-list"></i>

      </button>

      <span class="navbar-brand fw-semibold ms-2">
        RoomMate
      </span>

    </div>
  `;

  return header;
}

function createMainContent() {
  const main = document.createElement("main");

  main.className = "container-fluid py-4";

  main.id = "page-content";

  main.setAttribute("data-testid", "page-content");

  return main;
}

export function createLayout(root) {
  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "d-flex";

  const content = document.createElement("div");
  content.className = "flex-grow-1 rm-content";

  wrapper.appendChild(createSidebar());

  content.appendChild(createHeader());
  content.appendChild(createMainContent());

  wrapper.appendChild(content);

  root.appendChild(wrapper);
  root.appendChild(createMobileMenu());
}