/**
 * @file alert-list.js
 * @description Component hiển thị danh sách cảnh báo Dashboard.
 */

/**
 * Escape HTML.
 *
 * @param {*} value
 * @returns {string}
 */
function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

}

/**
 * Mapping Bootstrap badge/icon.
 */
const ALERT_CONFIG = {

  danger: {

    icon: "bi-exclamation-triangle-fill",

    badge: "danger"

  },

  warning: {

    icon: "bi-exclamation-circle-fill",

    badge: "warning"

  },

  info: {

    icon: "bi-info-circle-fill",

    badge: "info"

  },

  success: {

    icon: "bi-check-circle-fill",

    badge: "success"

  }

};

/**
 * Empty state.
 *
 * @returns {HTMLElement}
 */
function createEmptyState() {

  const element =
    document.createElement("div");

  element.className =
    "dashboard-alert-empty";

  element.innerHTML = `

<div class="text-center py-5">

    <i
        class="bi bi-check-circle
               text-success fs-1">
    </i>

    <h6 class="mt-3">

        Không có cảnh báo

    </h6>

    <p class="text-muted mb-0">

        Hệ thống đang hoạt động bình thường.

    </p>

</div>

`;

  return element;

}

/**
 * Tạo một dòng cảnh báo.
 *
 * @param {Object} alert
 * @returns {HTMLElement}
 */
function createAlertItem(
  alert
) {

  const {

    title = "",

    description = "",

    level = "info",

    time = "",

    action = "",

    id = ""

  } = alert;

  const config =
    ALERT_CONFIG[level] ??
    ALERT_CONFIG.info;

  const item =
    document.createElement(
      "div"
    );

  item.className =
    "dashboard-alert-item";

  if (id) {

    item.dataset.alertId =
      id;

  }

  item.innerHTML = `

<div class="d-flex align-items-start">

    <div
        class="dashboard-alert-icon
               text-${config.badge}">

        <i
            class="bi ${config.icon}">
        </i>

    </div>

    <div class="flex-grow-1">

        <div
            class="dashboard-alert-title">

            ${escapeHtml(title)}

        </div>

        <div
            class="dashboard-alert-description">

            ${escapeHtml(description)}

        </div>

        ${
          time
            ? `
<div
 class="dashboard-alert-time">

${escapeHtml(time)}

</div>
`
            : ""
        }

    </div>

    ${
      action
        ? `
<button
class="btn btn-sm btn-outline-primary dashboard-alert-action"
data-action="${escapeHtml(action)}">

Chi tiết

</button>
`
        : ""
    }

</div>

`;

  return item;

}

/**
 * Render danh sách cảnh báo.
 *
 * @param {HTMLElement} container
 * @param {Array} alerts
 */
export function renderAlertList(
  container,
  alerts = []
) {

  if (!container) {

    return;

  }

  container.innerHTML = "";

  if (
    alerts.length === 0
  ) {

    container.appendChild(
      createEmptyState()
    );

    return;

  }

  alerts.forEach(
    alert => {

      container.appendChild(

        createAlertItem(
          alert
        )

      );

    }
  );

}

/**
 * Xóa toàn bộ cảnh báo.
 *
 * @param {HTMLElement} container
 */
export function clearAlertList(
  container
) {

  if (!container) {

    return;

  }

  container.innerHTML = "";

}

/**
 * Hiển thị trạng thái đang tải.
 *
 * @param {HTMLElement} container
 */
export function renderAlertLoading(
  container
) {

  if (!container) {

    return;

  }

  container.innerHTML = `

<div
class="text-center py-5">

<div
class="spinner-border text-primary"
role="status">

<span
class="visually-hidden">

Loading...

</span>

</div>

<p
class="text-muted mt-3 mb-0">

Đang tải cảnh báo...

</p>

</div>

`;

}

/**
 * Hiển thị lỗi.
 *
 * @param {HTMLElement} container
 * @param {string} message
 */
export function renderAlertError(
  container,
  message
) {

  if (!container) {

    return;

  }

  container.innerHTML = `

<div
class="alert alert-danger mb-0">

<i
class="bi bi-exclamation-triangle-fill me-2">

</i>

${escapeHtml(
  message ||
  "Không thể tải danh sách cảnh báo."
)}

</div>

`;

}

/**
 * Đăng ký sự kiện khi
 * nhấn nút Chi tiết.
 *
 * @param {HTMLElement} container
 * @param {(id:string,action:string)=>void} callback
 */
export function bindAlertActions(
  container,
  callback
) {

  if (
    !container ||
    typeof callback !==
      "function"
  ) {

    return;

  }

  container.addEventListener(

    "click",

    event => {

      const button =
        event.target.closest(
          ".dashboard-alert-action"
        );

      if (!button) {

        return;

      }

      const item =
        button.closest(
          ".dashboard-alert-item"
        );

      callback(

        item?.dataset.alertId ??
          "",

        button.dataset.action ??
          ""

      );

    }

  );

}