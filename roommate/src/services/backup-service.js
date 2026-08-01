/**
 * @file backup-service.js
 * @description Import / Export dữ liệu RoomMate.
 */

import * as StorageService
    from "./storage-service.js";

import * as ImportValidator
    from "../business/import-validator.js";

import {
    seedData
} from "../data/seed-data.js";

/**
 * Danh sách collection.
 */
const COLLECTIONS = [

    "rooms",

    "tenants",

    "contracts",

    "meterReadings",

    "serviceConfigs",

    "invoices",

    "payments",

    "appSettings"

];

/**
 * Xuất toàn bộ dữ liệu.
 *
 * @returns {Object}
 */
export function exportData() {

    const backup = {};

    COLLECTIONS.forEach(

        collection => {

            backup[collection] =

                StorageService.getAll(
                    collection
                );

        }

    );

    backup.exportedAt =
        new Date().toISOString();

    backup.version =
        "1.0";

    return backup;

}

/**
 * Tạo tên file backup.
 *
 * @returns {string}
 */
function createBackupFileName() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    const hour =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );

    const minute =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );

    const second =
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );

    return

`roommate-backup-${year}${month}${day}-${hour}${minute}${second}.json`;

}

/**
 * Tải xuống file backup JSON.
 *
 * @returns {void}
 */
export function downloadBackup() {

    const data =
        exportData();

    const json =
        JSON.stringify(
            data,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type: "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href = url;

    link.download =
        createBackupFileName();

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );

    URL.revokeObjectURL(
        url
    );

}

/**
 * Đọc file JSON.
 *
 * @param {File} file
 * @returns {Promise<Object>}
 */
export function readJsonFile(
    file
) {

    const validation =
        ImportValidator.validateJsonFile(
            file
        );

    if (
        !validation.valid
    ) {

        return Promise.reject(
            new Error(
                validation.errors.join(
                    "\n"
                )
            )
        );

    }

    return new Promise(

        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();

            reader.onload =
                event => {

                    try {

                        const text =
                            event.target.result;

                        const data =
                            JSON.parse(
                                text
                            );

                        resolve(
                            data
                        );

                    }

                    catch {

                        reject(

                            new Error(
                                "File JSON không hợp lệ."
                            )

                        );

                    }

                };

            reader.onerror =
                () => {

                    reject(

                        new Error(
                            "Không thể đọc tệp."
                        )

                    );

                };

            reader.readAsText(
                file,
                "utf-8"
            );

        }

    );

}

/**
 * Kiểm tra dữ liệu backup.
 *
 * @param {Object} data
 * @returns {{
 *   valid: boolean,
 *   errors: string[]
 * }}
 */
export function validateBackupData(
    data
) {

    return ImportValidator
        .validateBackupData(
            data
        );

}

/**
 * Tạo backup trước khi ghi đè dữ liệu.
 *
 * @returns {Object}
 */
export function createBackupBeforeImport() {

    const backup =
        exportData();

    return {

        fileName:
            createBackupFileName(),

        data: backup,

        createdAt:
            new Date().toISOString()

    };

}

/**
 * Import dữ liệu.
 *
 * @param {Object} data
 * @param {Object} options
 * @returns {{
 *   success:boolean,
 *   backup?:Object,
 *   imported:number,
 *   errors:string[]
 * }}
 */
export function importData(
    data,
    options = {}
) {

    const validation =
        validateBackupData(data);

    if (!validation.valid) {

        return {

            success: false,

            imported: 0,

            errors: validation.errors

        };

    }

    const optionValidation =
        ImportValidator.validateImportOptions(
            options
        );

    if (!optionValidation.valid) {

        return {

            success: false,

            imported: 0,

            errors: optionValidation.errors

        };

    }

    const mode =
        options.mode ??
        "merge";

    let backup = null;

    if (
        mode ===
        "overwrite"
    ) {

        backup =
            createBackupBeforeImport();

    }

    try {

        COLLECTIONS.forEach(

            collection => {

                const incoming =
                    Array.isArray(
                        data[collection]
                    )

                        ? data[collection]

                        : [];

                if (
                    mode ===
                    "overwrite"
                ) {

                    StorageService.setAll(
                        collection,
                        incoming
                    );

                }

                else {

                    const current =
                        StorageService.getAll(
                            collection
                        );

                    const merged =
                        mergeCollection(
                            current,
                            incoming
                        );

                    StorageService.setAll(
                        collection,
                        merged
                    );

                }

            }

        );

        return {

            success: true,

            backup,

            imported:
                COLLECTIONS.length,

            errors: []

        };

    }

    catch (error) {

        return {

            success: false,

            backup,

            imported: 0,

            errors: [

                error.message

            ]

        };

    }

}

/**
 * Gộp dữ liệu theo id.
 *
 * Nếu id trùng thì dữ liệu mới
 * sẽ ghi đè dữ liệu cũ.
 *
 * @param {Array} current
 * @param {Array} incoming
 * @returns {Array}
 */
function mergeCollection(
    current = [],
    incoming = []
) {

    const map =
        new Map();

    current.forEach(

        item => {

            map.set(
                item.id,
                item
            );

        }

    );

    incoming.forEach(

        item => {

            map.set(
                item.id,
                item
            );

        }

    );

    return [

        ...map.values()

    ];

}