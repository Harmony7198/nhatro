/**
 * reports-page.js
 */

import Chart from "chart.js/auto";

import * as ReportService
    from "../services/report-service.js";

import {

    createReportFilters,

    bindFilterEvents,

    getFilterValues

} from "../components/report-filters.js";

let revenueChart = null;
let debtChart = null;
let invoiceChart = null;

/**
 * Destroy toàn bộ chart.
 */
function destroyCharts() {

    if (revenueChart) {

        revenueChart.destroy();
        revenueChart = null;

    }

    if (debtChart) {

        debtChart.destroy();
        debtChart = null;

    }

    if (invoiceChart) {

        invoiceChart.destroy();
        invoiceChart = null;

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

Đang tải báo cáo...

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

<i class="bi bi-bar-chart-line"></i>

<h5>

Không có dữ liệu báo cáo

</h5>

<p>

Hãy thay đổi bộ lọc hoặc tạo dữ liệu.

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
 * Layout.
 */
function createLayout() {

    return `

<div class="reports-page">

<div id="reports-filter"></div>

<div class="row mt-4">

<div class="col-lg-8">

<div class="card">

<div class="card-header">

Doanh thu theo tháng

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

Trạng thái hóa đơn

</div>

<div class="card-body">

<canvas

id="invoice-chart"

height="120"

data-testid="invoice-chart"

></canvas>

</div>

</div>

</div>

</div>

<div class="row mt-4">

<div class="col-lg-12">

<div class="card">

<div class="card-header">

Công nợ theo phòng

</div>

<div class="card-body">

<canvas

id="debt-chart"

height="120"

data-testid="debt-chart"

></canvas>

</div>

</div>

</div>

</div>

<div
id="report-tables"
class="mt-4">

</div>

</div>

`;

}

/**
 * Render Reports Page.
 */
export async function renderReportsPage(
    container
) {

    try {

        renderLoading(
            container
        );

        container.innerHTML =
            createLayout();

        document
            .getElementById(
                "reports-filter"
            )
            .appendChild(

                createReportFilters()

            );

        bindFilterEvents(
            refreshReports
        );

        refreshReports();

    }

    catch (error) {

        renderError(
            container,
            error
        );

    }

}

/**
 * Làm mới dữ liệu báo cáo.
 */
function refreshReports() {

    const filters =
        getFilterValues();

    const month =

        filters.month
            ? `${filters.year}-${filters.month}`
            : null;

    const charts =
        ReportService.getDashboardCharts(
            month
        );

    if (
        !charts
    ) {

        renderEmpty(
            document.querySelector(
                ".reports-page"
            )
        );

        return;

    }

    renderCharts(
        charts
    );

    renderTables(
        month
    );

}

/**
 * Render toàn bộ biểu đồ.
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

    renderDebtChart(
        charts.debtByRoom
    );

    renderInvoiceStatusChart(
        charts.invoiceStatus
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

    revenueChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        chartData.labels ?? [],

                    datasets: [

                        {

                            label:
                                "Doanh thu",

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

                            display: false

                        }

                    }

                }

            }

        );

}

/**
 * Biểu đồ công nợ.
 *
 * @param {Object} chartData
 */
function renderDebtChart(
    chartData
) {

    const canvas =
        document.getElementById(
            "debt-chart"
        );

    if (
        !canvas ||
        !chartData
    ) {

        return;

    }

    debtChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        chartData.labels ?? [],

                    datasets: [

                        {

                            label:
                                "Công nợ",

                            data:
                                chartData.data ?? []

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    indexAxis: "y"

                }

            }

        );

}

/**
 * Biểu đồ trạng thái hóa đơn.
 *
 * @param {Object} chartData
 */
function renderInvoiceStatusChart(
    chartData
) {

    const canvas =
        document.getElementById(
            "invoice-chart"
        );

    if (
        !canvas ||
        !chartData
    ) {

        return;

    }

    invoiceChart =
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
 * Render toàn bộ bảng.
 *
 * @param {string|null} month
 */
function renderTables(
    month
) {

    const container =
        document.getElementById(
            "report-tables"
        );

    if (!container) {

        return;

    }

    container.innerHTML = "";

    container.appendChild(

        createRevenueTable(
            month
        )

    );

    container.appendChild(

        createDebtTable(
            month
        )

    );

    container.appendChild(

        createUtilityTable(
            month
        )

    );

}

function createRevenueTable(
    month
) {

    const revenue =
        ReportService
            .getRevenueChartData(
                month
            );

    const collected =
        ReportService
            .getCollectedChartData(
                month
            );

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "card mb-4";

    card.innerHTML = `

<div class="card-header">

Doanh thu & Tiền thực thu

</div>

<div class="card-body">

<table
class="table table-striped"
data-testid="revenue-table">

<thead>

<tr>

<th>Tháng</th>

<th>Doanh thu</th>

<th>Thực thu</th>

</tr>

</thead>

<tbody>

${revenue.labels.map(

(label,index)=>`

<tr>

<td>${label}</td>

<td>${Number(
revenue.data[index]??0
).toLocaleString("vi-VN")}</td>

<td>${Number(
collected.data[index]??0
).toLocaleString("vi-VN")}</td>

</tr>

`

).join("")}

</tbody>

</table>

</div>

`;

    return card;

}

function createDebtTable() {

    const rows =
        ReportService
            .getDebtByRoom();

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "card mb-4";

    card.innerHTML = `

<div class="card-header">

Công nợ theo phòng

</div>

<div class="card-body">

<table
class="table table-hover"
data-testid="debt-table">

<thead>

<tr>

<th>Phòng</th>

<th>Công nợ</th>

</tr>

</thead>

<tbody>

${rows.map(

row=>`

<tr>

<td>${row.key}</td>

<td>${Number(
row.total
).toLocaleString("vi-VN")} ₫</td>

</tr>

`

).join("")}

</tbody>

</table>

</div>

`;

    return card;

}

function createUtilityTable(
    month
) {

    const electric =
        ReportService
            .getElectricUsageByRoom(
                month
            );

    const water =
        ReportService
            .getWaterUsageByRoom?.(
                month
            ) ?? [];

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "card";

    card.innerHTML = `

<div class="card-header">

Điện & Nước theo phòng

</div>

<div class="card-body">

<table
class="table table-bordered"
data-testid="utility-table">

<thead>

<tr>

<th>Phòng</th>

<th>Điện (kWh)</th>

<th>Nước (m³)</th>

</tr>

</thead>

<tbody>

${electric.map(

(item,index)=>`

<tr>

<td>${item.key}</td>

<td>${item.total}</td>

<td>${water[index]?.total ?? 0}</td>

</tr>

`

).join("")}

</tbody>

</table>

</div>

`;

    return card;

}

/**
 * Đăng ký sự kiện.
 */
function bindEvents() {

    bindFilterEvents(
        refreshReports
    );

}

/**
 * Giải phóng tài nguyên.
 */
export function destroyReportsPage() {

    destroyCharts();

}
function refreshReports() {

    const filters =
        getFilterValues();

    const reports =

        ReportService
            .getDashboardData(
                filters.month
            );

    if (!reports) {

        renderEmpty(
            document.querySelector(
                ".reports-page"
            )
        );

        return;

    }

    renderCharts(
        reports.charts
    );

    renderTables(
        filters.month
    );

}

