/**
 * @file settings-page.js
 * @description Trang cài đặt hệ thống.
 */

import * as BackupService
    from "../services/backup-service.js";

import * as SeedService
    from "../services/seed-service.js";

import * as StorageService
    from "../services/storage-service.js";

let selectedFile = null;

/**
 * Loading.
 */
function renderLoading(container) {

    container.innerHTML = `

<div class="text-center py-5">

<div class="spinner-border"></div>

<p class="mt-3">

Đang tải cài đặt...

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
 * Tạo layout.
 *
 * @returns {string}
 */
function createLayout() {

    return `

<div class="settings-page">

<div class="row g-4">

<div class="col-lg-6">

<div
id="backup-card">

</div>

</div>

<div class="col-lg-6">

<div
id="import-card">

</div>

</div>

<div class="col-lg-6">

<div
id="seed-card">

</div>

</div>

<div class="col-lg-6">

<div
id="danger-card">

</div>

</div>

<div class="col-12">

<div
id="statistics-card">

</div>

</div>

</div>

</div>

`;

}

/**
 * Thống kê số lượng record.
 *
 * @returns {Array}
 */
function getCollectionStatistics() {

    return [

        {

            name:
                "Rooms",

            total:
                StorageService
                    .getAll(
                        "rooms"
                    ).length

        },

        {

            name:
                "Tenants",

            total:
                StorageService
                    .getAll(
                        "tenants"
                    ).length

        },

        {

            name:
                "Contracts",

            total:
                StorageService
                    .getAll(
                        "contracts"
                    ).length

        },

        {

            name:
                "Meter Readings",

            total:
                StorageService
                    .getAll(
                        "meterReadings"
                    ).length

        },

        {

            name:
                "Services",

            total:
                StorageService
                    .getAll(
                        "serviceConfigs"
                    ).length

        },

        {

            name:
                "Invoices",

            total:
                StorageService
                    .getAll(
                        "invoices"
                    ).length

        },

        {

            name:
                "Payments",

            total:
                StorageService
                    .getAll(
                        "payments"
                    ).length

        },

        {

            name:
                "Settings",

            total:
                StorageService
                    .getAll(
                        "appSettings"
                    ).length

        }

    ];

}

/**
 * Render Settings.
 */
export function renderSettingsPage(
    container
) {

    try {

        renderLoading(
            container
        );

        container.innerHTML =
            createLayout();

        renderBackupCard();

        renderImportCard();

        renderSeedCard();

        renderDangerCard();

        renderStatisticsCard();

    }

    catch (error) {

        renderError(
            container,
            error
        );

    }

}

/**
 * Render Backup Card.
 */
function renderBackupCard() {

    const container =
        document.getElementById(
            "backup-card"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

<div
class="card shadow-sm">

<div class="card-header">

<i class="bi bi-download me-2"></i>

Sao lưu dữ liệu

</div>

<div class="card-body">

<p class="text-muted">

Xuất toàn bộ dữ liệu hệ thống
thành tệp JSON.

</p>

<button

id="export-data-btn"

class="btn btn-primary"

data-testid="export-button"

>

<i class="bi bi-download me-1"></i>

Export JSON

</button>

</div>

</div>

`;

    document
        .getElementById(
            "export-data-btn"
        )
        ?.addEventListener(

            "click",

            () => {

                BackupService
                    .downloadBackup();

            }

        );

}

/**
 * Render Import Card.
 */
function renderImportCard() {

    const container =
        document.getElementById(
            "import-card"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

<div class="card shadow-sm">

<div class="card-header">

<i class="bi bi-upload me-2"></i>

Nhập dữ liệu

</div>

<div class="card-body">

<p class="text-muted">

Chỉ hỗ trợ tệp JSON.

</p>

<input

type="file"

id="backup-file"

class="form-control"

accept=".json,application/json"

data-testid="backup-file"

/>

<div

id="backup-file-info"

class="small text-muted mt-3"

>

Chưa chọn tệp.

</div>

<div

id="backup-validation"

class="mt-3"

>

</div>

<div
class="d-flex gap-2 mt-4">

<button

id="merge-import-btn"

class="btn btn-success"

disabled

data-testid="merge-import"

>

Gộp dữ liệu

</button>

<button

id="overwrite-import-btn"

class="btn btn-warning"

disabled

data-testid="overwrite-import"

>

Ghi đè

</button>

</div>

</div>

</div>

`;

    const input =
        document.getElementById(
            "backup-file"
        );

    input?.addEventListener(

        "change",

        async event => {

            selectedFile =
                event.target.files?.[0] ??
                null;

            await updateSelectedFile();

        }

    );

    document
        .getElementById(
            "merge-import-btn"
        )
        ?.addEventListener(

            "click",

            () => {

                importSelectedFile(
                    "merge"
                );

            }

        );

    document
        .getElementById(
            "overwrite-import-btn"
        )
        ?.addEventListener(

            "click",

            () => {

                importSelectedFile(
                    "overwrite"
                );

            }

        );

}

/**
 * Hiển thị thông tin file.
 */
async function updateSelectedFile() {

    const info =
        document.getElementById(
            "backup-file-info"
        );

    const validation =
        document.getElementById(
            "backup-validation"
        );

    const mergeButton =
        document.getElementById(
            "merge-import-btn"
        );

    const overwriteButton =
        document.getElementById(
            "overwrite-import-btn"
        );

    if (!selectedFile) {

        info.textContent =
            "Chưa chọn tệp.";

        validation.innerHTML = "";

        mergeButton.disabled = true;
        overwriteButton.disabled = true;

        return;

    }

    info.innerHTML = `

<div>

<strong>${selectedFile.name}</strong>

</div>

<div>

${(
    selectedFile.size / 1024
).toFixed(2)} KB

</div>

`;

    try {

        const data =
            await BackupService
                .readJsonFile(
                    selectedFile
                );

        const result =
            BackupService
                .validateBackupData(
                    data
                );

        if (!result.valid) {

            validation.innerHTML = `

<div class="alert alert-danger mb-0">

${result.errors.join("<br>")}

</div>

`;

            mergeButton.disabled = true;
            overwriteButton.disabled = true;

            return;

        }

        validation.innerHTML = `

<div class="alert alert-success mb-0">

Dữ liệu hợp lệ.

</div>

`;

        mergeButton.disabled = false;
        overwriteButton.disabled = false;

    }

    catch (error) {

        validation.innerHTML = `

<div class="alert alert-danger mb-0">

${error.message}

</div>

`;

        mergeButton.disabled = true;
        overwriteButton.disabled = true;

    }

}

/**
 * Import file đã chọn.
 *
 * @param {"merge"|"overwrite"} mode
 */
async function importSelectedFile(
    mode
) {

    if (!selectedFile) {

        return;

    }

    try {

        const data =
            await BackupService.readJsonFile(
                selectedFile
            );

        const validation =
            BackupService.validateBackupData(
                data
            );

        if (!validation.valid) {

            alert(
                validation.errors.join("\n")
            );

            return;

        }

        if (
            mode === "overwrite"
        ) {

            const confirmed =
                window.confirm(

`Thao tác này sẽ ghi đè toàn bộ dữ liệu hiện tại.

Một bản sao lưu sẽ được tạo trước khi import.

Bạn có chắc chắn muốn tiếp tục?`

                );

            if (!confirmed) {

                return;

            }

        }

        const result =
            BackupService.importData(
                data,
                {
                    mode
                }
            );

        if (!result.success) {

            alert(
                result.errors.join("\n")
            );

            return;

        }

        alert(
            "Import dữ liệu thành công."
        );

        selectedFile = null;

        resetImportSection();

        renderStatisticsCard();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}
/**
 * Reset giao diện import.
 */
function resetImportSection() {

    const input =
        document.getElementById(
            "backup-file"
        );

    if (input) {

        input.value = "";

    }

    const info =
        document.getElementById(
            "backup-file-info"
        );

    if (info) {

        info.textContent =
            "Chưa chọn tệp.";

    }

    const validation =
        document.getElementById(
            "backup-validation"
        );

    if (validation) {

        validation.innerHTML = "";

    }

    document
        .getElementById(
            "merge-import-btn"
        )
        ?.setAttribute(
            "disabled",
            true
        );

    document
        .getElementById(
            "overwrite-import-btn"
        )
        ?.setAttribute(
            "disabled",
            true
        );

}

/**
 * Render Seed Card.
 */
function renderSeedCard() {

    const container =
        document.getElementById(
            "seed-card"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

<div class="card shadow-sm">

<div class="card-header">

<i class="bi bi-database me-2"></i>

Dữ liệu mẫu

</div>

<div class="card-body">

<p class="text-muted">

Khởi tạo hoặc khôi phục dữ liệu mẫu
để thử nghiệm hệ thống.

</p>

<div class="d-grid gap-2">

<button

id="create-seed-btn"

class="btn btn-success"

data-testid="create-seed-button"

>

<i class="bi bi-plus-circle me-1"></i>

Tạo dữ liệu mẫu

</button>

<button

id="restore-seed-btn"

class="btn btn-outline-primary"

data-testid="restore-seed-button"

>

<i class="bi bi-arrow-clockwise me-1"></i>

Khôi phục dữ liệu mẫu

</button>

</div>

</div>

</div>

`;

    document
        .getElementById(
            "create-seed-btn"
        )
        ?.addEventListener(

            "click",

            createSeedData

        );

    document
        .getElementById(
            "restore-seed-btn"
        )
        ?.addEventListener(

            "click",

            restoreSeedData

        );

}

/**
 * Tạo dữ liệu mẫu.
 */
async function createSeedData() {

    try {

        const result =
            await SeedService.createSeedData();

        if (
            result?.success === false
        ) {

            alert(
                result.message ??
                "Không thể tạo dữ liệu mẫu."
            );

            return;

        }

        alert(
            "Đã tạo dữ liệu mẫu."
        );

        renderStatisticsCard();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}

/**
 * Khôi phục dữ liệu mẫu.
 */
async function restoreSeedData() {

    const confirmed =
        window.confirm(

`Thao tác này sẽ khôi phục dữ liệu mẫu.

Dữ liệu hiện tại có thể bị ghi đè.

Bạn có muốn tiếp tục?`

        );

    if (!confirmed) {

        return;

    }

    try {

        const result =
            await SeedService.restoreSeedData();

        if (
            result?.success === false
        ) {

            alert(
                result.message ??
                "Không thể khôi phục dữ liệu mẫu."
            );

            return;

        }

        alert(
            "Khôi phục dữ liệu mẫu thành công."
        );

        renderStatisticsCard();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}

/**
 * Render Danger Zone.
 */
function renderDangerCard() {

    const container =
        document.getElementById(
            "danger-card"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

<div
class="card border-danger shadow-sm">

<div
class="card-header bg-danger text-white">

<i class="bi bi-exclamation-triangle me-2"></i>

Danger Zone

</div>

<div class="card-body">

<div
class="alert alert-warning mb-4">

<strong>Cảnh báo:</strong>

Các thao tác dưới đây có thể làm mất
toàn bộ dữ liệu hiện có.

</div>

<div class="d-grid">

<button

id="reset-data-btn"

class="btn btn-danger"

data-testid="reset-data-button"

>

<i class="bi bi-trash me-1"></i>

Xóa toàn bộ dữ liệu

</button>

</div>

</div>

</div>

`;

    document

        .getElementById(
            "reset-data-btn"
        )

        ?.addEventListener(

            "click",

            resetApplicationData

        );

}

/**
 * Xóa toàn bộ dữ liệu.
 */
async function resetApplicationData() {

    const confirmed =
        window.confirm(

`Thao tác này sẽ xóa toàn bộ dữ liệu của hệ thống.

Hành động này không thể hoàn tác.

Bạn có chắc chắn muốn tiếp tục?`

        );

    if (!confirmed) {

        return;

    }

    try {

        BackupService.resetAllData();

        alert(
            "Đã xóa toàn bộ dữ liệu."
        );

        renderStatisticsCard();

        resetImportSection();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}

/**
 * Render thống kê dữ liệu.
 */
function renderStatisticsCard() {

    const container =
        document.getElementById(
            "statistics-card"
        );

    if (!container) {

        return;

    }

    const statistics =
        BackupService.getCollectionStatistics();

    container.innerHTML = `

<div class="card shadow-sm">

<div class="card-header">

<i class="bi bi-bar-chart me-2"></i>

Thống kê dữ liệu

</div>

<div class="card-body">

<div class="row g-3">

${statistics.map(

item => `

<div class="col-md-3 col-sm-6">

<div
class="collection-stat"
data-testid="collection-${item.key}">

<div
class="collection-name">

${item.label}

</div>

<div
class="collection-total">

${item.total.toLocaleString("vi-VN")}

</div>

</div>

</div>

`

).join("")}

</div>

</div>

</div>

`;

}


[
    {
        key: "rooms",
        label: "Phòng",
        total: 24
    },
    {
        key: "tenants",
        label: "Người thuê",
        total: 18
    },
    {
        key: "contracts",
        label: "Hợp đồng",
        total: 18
    },
    {
        key: "meterReadings",
        label: "Chỉ số",
        total: 36
    },
    {
        key: "serviceConfigs",
        label: "Dịch vụ",
        total: 5
    },
    {
        key: "invoices",
        label: "Hóa đơn",
        total: 120
    },
    {
        key: "payments",
        label: "Thanh toán",
        total: 108
    },
    {
        key: "appSettings",
        label: "Cài đặt",
        total: 1
    }
]


/**
 * Làm mới toàn bộ trang Settings.
 */
export function refreshSettingsPage() {

    const container =
        document.querySelector(
            ".settings-page"
        )?.parentElement;

    if (!container) {

        return;

    }

    renderSettingsPage(
        container
    );

}

/**
 * Đăng ký sự kiện.
 */
function bindEvents() {

    // Placeholder.
    // Các component hiện đã tự bind
    // trong quá trình render.

}

/**
 * Hủy trang.
 */
export function destroySettingsPage() {

    selectedFile = null;

}