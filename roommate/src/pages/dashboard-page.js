/**
 * dashboard-page.js
 */

import Chart from "chart.js/auto";

import * as ReportService
  from "../services/report-service.js";

import {

  createStatCardGrid

} from "../components/stat-card.js";

import {

  renderAlertList,

  renderAlertLoading,

  renderAlertError,

  bindAlertActions

} from "../components/alert-list.js";

let revenueChart = null;
let roomChart = null;

/**
 * Destroy chart cũ.
 */
function destroyCharts() {

  if (revenueChart) {

    revenueChart.destroy();
    revenueChart = null;

  }

  if (roomChart) {

    roomChart.destroy();
    roomChart = null;

  }

}

/**
 * Loading.
 */
function renderLoading(container) {

  container.innerHTML = `

<div class="text-center py-5">

<div class="spinner-border"></div>

<p class="mt-3">

Đang tải Dashboard...

</p>

</div>

`;

}

/**
 * Empty.
 */
function renderEmpty(container) {

  container.innerHTML = `

<div class="empty-state">

<i class="bi bi-bar-chart"></i>

<h5>

Chưa có dữ liệu

</h5>

<p>

Hiện chưa có dữ liệu thống kê.

</p>

</div>

`;

}

/**
 * Error.
 */
function renderError(
  container,
  error
) {

  container.innerHTML = `

<div class="alert alert-danger">

${error.message}

</div>

`;

}

/**
 * Layout Dashboard.
 */
function createLayout() {

  return `

<div class="dashboard-page">

<div class="dashboard-toolbar">

<div>

<h2>

Dashboard

</h2>

<p class="text-muted">

Tổng quan hệ thống

</p>

</div>

<div>

<input

type="month"

class="form-control"

id="dashboard-month"

data-testid="dashboard-month-filter"

>

</div>

</div>

<div
id="dashboard-statistics">
</div>

<div class="row mt-4">

<div class="col-lg-8">

<div class="card">

<div class="card-header">

Doanh thu 6 tháng gần nhất

</div>

<div class="card-body">

<canvas

id="revenue-chart"

height="120"

data-testid="revenue-chart"

></canvas>

</div>

</div>

</div>

<div class="col-lg-4">

<div class="card">

<div class="card-header">

Trạng thái phòng

</div>

<div class="card-body">

<canvas

id="room-chart"

height="120"

data-testid="room-status-chart"

></canvas>

</div>

</div>

</div>

</div>

<div class="row mt-4">

<div class="col-lg-12">

<div class="card">

<div class="card-header">

Cảnh báo

</div>

<div

class="card-body"

id="dashboard-alerts"

>

</div>

</div>

</div>

</div>

</div>

`;

}

/**
 * Render Dashboard.
 */
export async function renderDashboardPage(
  container
) {

  try {

    renderLoading(
      container
    );

    const summary =

      ReportService
        .getDashboardData();

    if (!summary) {

      renderEmpty(
        container
      );

      return;

    }

    container.innerHTML =
      createLayout();

    renderStatistics(
      summary.summary);

    renderCharts(
      summary.charts);

    renderAlerts(
      summary.summary);

    bindEvents();

  }

  catch (error) {

    renderError(
      container,
      error
    );

  }

}

/**
 * Render các thẻ thống kê.
 *
 * @param {Object} summary
 */
function renderStatistics(
  summary
) {

  const container =
    document.getElementById(
      "dashboard-statistics"
    );

  if (!container) {

    return;

  }

  const room =
    summary.rooms;

  const tenant =
    summary.tenants;

  const finance =
    summary.finance;

  const utility =
    summary.utilities;

  const cards = [

    {
      title: "Tổng số phòng",
      value: room.totalRooms,
      icon: "bi-house-door-fill",
      color: "primary",
      testId: "total-rooms"
    },

    {
      title: "Phòng trống",
      value: room.emptyRooms,
      icon: "bi-door-open-fill",
      color: "secondary",
      testId: "empty-rooms"
    },

    {
      title: "Đang thuê",
      value: room.rentedRooms,
      icon: "bi-person-check-fill",
      color: "success",
      testId: "occupied-rooms"
    },

    {
      title: "Tỷ lệ lấp đầy",
      value: room.occupancyRate,
      unit: "%",
      icon: "bi-pie-chart-fill",
      color: "info",
      testId: "occupancy-rate"
    },

    {
      title: "Người thuê",
      value: tenant.totalTenants,
      icon: "bi-people-fill",
      color: "primary",
      testId: "tenant-count"
    },

    {
      title: "Doanh thu tháng",
      value: finance.revenue,
      unit: "₫",
      icon: "bi-cash-stack",
      color: "success",
      testId: "monthly-revenue"
    },

    {
      title: "Tổng công nợ",
      value: finance.totalDebt,
      unit: "₫",
      icon: "bi-exclamation-diamond-fill",
      color: "danger",
      testId: "total-debt"
    },

    {
      title: "Hóa đơn quá hạn",
      value: finance.overdueInvoiceCount,
      icon: "bi-alarm-fill",
      color: "warning",
      testId: "overdue-invoices"
    },

    {
      title: "Điện tiêu thụ",
      value: utility.electricUsage,
      unit: "kWh",
      icon: "bi-lightning-charge-fill",
      color: "warning",
      testId: "electric-usage"
    },

    {
      title: "Nước tiêu thụ",
      value: utility.waterUsage,
      unit: "m³",
      icon: "bi-droplet-fill",
      color: "info",
      testId: "water-usage"
    }

  ];

  container.innerHTML = "";

  container.appendChild(
    createStatCardGrid(
      cards
    )
  );

}

/**
 * Render Chart.js.
 *
 * @param {Object} charts
 */
function renderCharts(
  charts
) {

  destroyCharts();

  renderRevenueChart(
    charts.revenue
  );

  renderRoomStatusChart(
    charts.roomStatus
  );

}

/**
 * Biểu đồ doanh thu.
 *
 * @param {Object} chartData
 */
function renderRevenueChart(
  chartData
) {

  const canvas =
    document.getElementById(
      "revenue-chart"
    );

  if (
    !canvas ||
    !chartData
  ) {

    return;

  }

  const labels =
    chartData.labels ?? [];

  const values =
    chartData.data ?? [];

  revenueChart =
    new Chart(
      canvas,
      {

        type: "bar",

        data: {

          labels,

          datasets: [

            {

              label:
                "Doanh thu",

              data:
                values

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {

              display: false

            }

          }

        }

      }

    );

}

/**
 * Biểu đồ trạng thái phòng.
 *
 * @param {Object} chartData
 */
function renderRoomStatusChart(
  chartData
) {

  const canvas =
    document.getElementById(
      "room-chart"
    );

  if (
    !canvas ||
    !chartData
  ) {

    return;

  }

  roomChart =
    new Chart(

      canvas,

      {

        type: "doughnut",

        data: {

          labels:
            chartData.labels ?? [],

          datasets: [

            {

              data:
                chartData.data ?? []

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {

              position:
                "bottom"

            }

          }

        }

      }

    );

}

/**
 * Render danh sách cảnh báo.
 *
 * @param {Object} summary
 */
function renderAlerts(
  summary
) {

  const container =
    document.getElementById(
      "dashboard-alerts"
    );

  if (!container) {

    return;

  }

  renderAlertLoading(
    container
  );

  const alerts = [];

  // Hóa đơn quá hạn
  if (
    summary.finance
      .overdueInvoiceCount > 0
  ) {

    alerts.push({

      id: "overdue",

      title: "Hóa đơn quá hạn",

      description:

        `Có ${summary.finance.overdueInvoiceCount} hóa đơn quá hạn.`,

      level: "danger",

      action: "invoice"

    });

  }

  // Công nợ
  if (
    summary.finance
      .totalDebt > 0
  ) {

    alerts.push({

      id: "debt",

      title: "Công nợ",

      description:

        `Tổng công nợ ${summary.finance.totalDebt.toLocaleString("vi-VN")} ₫`,

      level: "warning",

      action: "debt"

    });

  }

  // Hợp đồng
  if (
    summary.contracts
      ?.expiringCount > 0
  ) {

    alerts.push({

      id: "contract",

      title:
        "Hợp đồng sắp hết hạn",

      description:

        `${summary.contracts.expiringCount} hợp đồng sắp hết hạn.`,

      level: "info",

      action: "contract"

    });

  }

  renderAlertList(
    container,
    alerts
  );

}

/**
 * Đăng ký sự kiện.
 */
function bindEvents() {

  const monthInput =
    document.getElementById(
      "dashboard-month"
    );

  if (monthInput) {

    monthInput.addEventListener(

      "change",

      refreshDashboard

    );

  }

  const alertContainer =
    document.getElementById(
      "dashboard-alerts"
    );

  bindAlertActions(

    alertContainer,

    handleAlertAction

  );

}


/**
 * Refresh Dashboard.
 */
function refreshDashboard() {

  const month =

    document
      .getElementById(
        "dashboard-month"
      )
      ?.value ||

    null;

  const data =

    ReportService
      .getDashboardData(
        month
      );

  renderStatistics(
    data.summary
  );

  renderCharts(
    data.charts
  );

  renderAlerts(
    data.summary
  );

}



/**
 * Click cảnh báo.
 *
 * @param {string} id
 * @param {string} action
 */
function handleAlertAction(
  id,
  action
) {

  switch (action) {

    case "invoice":

      location.hash =
        "#/invoices";

      break;

    case "debt":

      location.hash =
        "#/debts";

      break;

    case "contract":

      location.hash =
        "#/contracts";

      break;

    default:

      break;

  }

}


/**
 * Hủy Dashboard.
 */
export function destroyDashboardPage() {

  destroyCharts();

}

