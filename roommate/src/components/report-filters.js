/**
 * @file report-filters.js
 * @description Bộ lọc báo cáo.
 */

/**
 * Danh sách loại báo cáo.
 */
const REPORT_TYPES = [
  {
    value: "all",
    label: "Tất cả báo cáo"
  },
  {
    value: "revenue",
    label: "Doanh thu"
  },
  {
    value: "collection",
    label: "Tiền thực thu"
  },
  {
    value: "debt",
    label: "Công nợ"
  },
  {
    value: "electric",
    label: "Điện"
  },
  {
    value: "water",
    label: "Nước"
  },
  {
    value: "invoice",
    label: "Hóa đơn"
  },
  {
    value: "payment",
    label: "Thanh toán"
  }
];

/**
 * Tạo option.
 *
 * @param {string} value
 * @param {string} label
 * @returns {string}
 */
function createOption(
  value,
  label
) {

  return `

<option value="${value}">

${label}

</option>

`;

}

/**
 * Sinh danh sách năm.
 *
 * @param {number} total
 * @returns {string}
 */
function createYearOptions(
  total = 5
) {

  const current =
    new Date().getFullYear();

  let html = "";

  for (
    let i = current - total;
    i <= current + 1;
    i++
  ) {

    html += createOption(
      i,
      String(i)
    );

  }

  return html;

}

/**
 * Sinh tháng.
 *
 * @returns {string}
 */
function createMonthOptions() {

  let html =
    createOption(
      "",
      "Tất cả"
    );

  for (
    let i = 1;
    i <= 12;
    i++
  ) {

    html += createOption(
      String(i).padStart(
        2,
        "0"
      ),

      `Tháng ${i}`

    );

  }

  return html;

}

/**
 * Render filter.
 *
 * @returns {HTMLElement}
 */
export function createReportFilters() {

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "report-filters card";

  wrapper.innerHTML = `

<div class="card-body">

<div class="row g-3">

<div class="col-md-3">

<label class="form-label">

Năm

</label>

<select

class="form-select"

id="report-year"

data-testid="report-year"

>

${createYearOptions()}

</select>

</div>

<div class="col-md-3">

<label class="form-label">

Tháng

</label>

<select

class="form-select"

id="report-month"

data-testid="report-month"

>

${createMonthOptions()}

</select>

</div>

<div class="col-md-4">

<label class="form-label">

Loại báo cáo

</label>

<select

class="form-select"

id="report-type"

data-testid="report-type"

>

${REPORT_TYPES
  .map(type =>
    createOption(
      type.value,
      type.label
    )
  )
  .join("")}

</select>

</div>

<div class="col-md-2 d-flex align-items-end">

<button

class="btn btn-primary w-100"

id="report-refresh"

data-testid="report-refresh"

>

<i class="bi bi-arrow-clockwise me-1"></i>

Làm mới

</button>

</div>

</div>

</div>

`;

  return wrapper;

}

/**
 * Lấy giá trị bộ lọc.
 *
 * @returns {Object}
 */
export function getFilterValues() {

  return {

    year:

      document
        .getElementById(
          "report-year"
        )
        ?.value ||

      "",

    month:

      document
        .getElementById(
          "report-month"
        )
        ?.value ||

      "",

    type:

      document
        .getElementById(
          "report-type"
        )
        ?.value ||

      "all"

  };

}

/**
 * Gán giá trị bộ lọc.
 *
 * @param {Object} values
 */
export function setFilterValues(
  values = {}
) {

  const year =
    document.getElementById(
      "report-year"
    );

  const month =
    document.getElementById(
      "report-month"
    );

  const type =
    document.getElementById(
      "report-type"
    );

  if (
    year &&
    values.year !== undefined
  ) {

    year.value =
      values.year;

  }

  if (
    month &&
    values.month !== undefined
  ) {

    month.value =
      values.month;

  }

  if (
    type &&
    values.type !== undefined
  ) {

    type.value =
      values.type;

  }

}

/**
 * Đặt lại bộ lọc.
 */
export function resetFilters() {

  const now =
    new Date();

  setFilterValues({

    year:
      String(
        now.getFullYear()
      ),

    month:
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

    type:
      "all"

  });

}

/**
 * Đăng ký sự kiện.
 *
 * @param {Function} callback
 */
export function bindFilterEvents(
  callback
) {

  if (
    typeof callback !==
    "function"
  ) {

    return;

  }

  [

    "report-year",

    "report-month",

    "report-type"

  ].forEach(id => {

    const element =
      document.getElementById(
        id
      );

    element?.addEventListener(

      "change",

      () => {

        callback(
          getFilterValues()
        );

      }

    );

  });

  document
    .getElementById(
      "report-refresh"
    )
    ?.addEventListener(

      "click",

      () => {

        callback(
          getFilterValues()
        );

      }

    );

}

/**
 * Hủy component.
 */
export function destroyReportFilters() {

  const wrapper =
    document.querySelector(
      ".report-filters"
    );

  wrapper?.remove();

}

