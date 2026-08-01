/**
 * @file stat-card.js
 * @description Component hiển thị thẻ thống kê.
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
 * Format giá trị hiển thị.
 *
 * @param {*} value
 * @returns {string}
 */
function formatValue(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "-";

  }

  if (
    typeof value === "number"
  ) {

    return value.toLocaleString("vi-VN");

  }

  return String(value);

}

/**
 * Tạo Stat Card.
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {*} options.value
 * @param {string} [options.icon]
 * @param {string} [options.color]
 * @param {string} [options.unit]
 * @param {string} [options.testId]
 *
 * @returns {HTMLElement}
 */
export function createStatCard({

  title,

  value,

  icon = "bi-bar-chart",

  color = "primary",

  unit = "",

  testId = ""

}) {

  const card =
    document.createElement(
      "div"
    );

  card.className =
    "stat-card card shadow-sm h-100";

  if (testId) {

    card.dataset.testid =
      testId;

  }

  card.innerHTML = `

<div class="card-body">

  <div class="stat-card-header">

    <div class="stat-icon bg-${escapeHtml(color)}">

      <i class="bi ${escapeHtml(icon)}"></i>

    </div>

  </div>

  <div class="stat-title">

    ${escapeHtml(title)}

  </div>

  <div class="stat-value">

    ${formatValue(value)}

    <span class="stat-unit">

      ${escapeHtml(unit)}

    </span>

  </div>

</div>

`;

  return card;

}

/**
 * Tạo container chứa nhiều Stat Card.
 *
 * @param {Array<Object>} items
 * @returns {HTMLElement}
 */
export function createStatCardGrid(
  items = []
) {

  const row =
    document.createElement(
      "div"
    );

  row.className =
    "row g-3";

  items.forEach(
    item => {

      const col =
        document.createElement(
          "div"
        );

      col.className =
        "col-12 col-sm-6 col-lg-3";

      col.appendChild(
        createStatCard(item)
      );

      row.appendChild(
        col
      );

    }
  );

  return row;

}

