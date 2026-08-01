/**
 * @file import-validator.js
 * @description Kiểm tra dữ liệu import/export.
 */

/**
 * Các collection bắt buộc.
 */
export const REQUIRED_COLLECTIONS = [
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
 * Kiểm tra file JSON.
 *
 * @param {File} file
 * @returns {{valid:boolean,errors:string[]}}
 */
export function validateJsonFile(file) {

    const errors = [];

    if (!file) {

        errors.push("Chưa chọn tệp.");

    } else {

        const isJsonType =
            file.type === "application/json";

        const isJsonExtension =
            file.name
                ?.toLowerCase()
                .endsWith(".json");

        if (
            !isJsonType &&
            !isJsonExtension
        ) {

            errors.push(
                "Tệp phải có định dạng JSON."
            );

        }

    }

    return {

        valid: errors.length === 0,
        errors

    };

}

/**
 * Kiểm tra một collection.
 *
 * @param {string} name
 * @param {*} value
 * @returns {string[]}
 */
export function validateCollectionArray(
    name,
    value
) {

    const errors = [];

    if (!Array.isArray(value)) {

        errors.push(
            `Collection "${name}" phải là một mảng.`
        );

    }

    return errors;

}

/**
 * Kiểm tra đủ collection.
 *
 * @param {Object} data
 * @returns {string[]}
 */
export function validateRequiredCollections(
    data
) {

    const errors = [];

    REQUIRED_COLLECTIONS.forEach(

        name => {

            if (
                !(name in data)
            ) {

                errors.push(
                    `Thiếu collection "${name}".`
                );

            }

        }

    );

    return errors;

}

/**
 * Kiểm tra tất cả collection.
 *
 * @param {Object} data
 * @returns {string[]}
 */
export function validateCollections(
    data
) {

    const errors = [];

    REQUIRED_COLLECTIONS.forEach(

        name => {

            if (
                name in data
            ) {

                errors.push(

                    ...validateCollectionArray(
                        name,
                        data[name]
                    )

                );

            }

        }

    );

    return errors;

}

/**
 * Validate dữ liệu backup.
 *
 * @param {*} data
 * @returns {{
 * valid:boolean,
 * errors:string[]
 * }}
 */
export function validateBackupData(
    data
) {

    const errors = [];

    if (

        data === null ||

        typeof data !==
        "object" ||

        Array.isArray(data)

    ) {

        errors.push(
            "Dữ liệu backup không hợp lệ."
        );

        return {

            valid: false,
            errors

        };

    }

    errors.push(

        ...validateRequiredCollections(
            data
        )

    );

    errors.push(

        ...validateCollections(
            data
        )

    );

    return {

        valid:
            errors.length === 0,

        errors

    };

}

/**
 * Kiểm tra tùy chọn import.
 *
 * @param {Object} options
 * @returns {{
 * valid:boolean,
 * errors:string[]
 * }}
 */
export function validateImportOptions(
    options = {}
) {

    const errors = [];

    const mode =
        options.mode ??
        "merge";

    if (

        mode !== "merge" &&

        mode !== "overwrite"

    ) {

        errors.push(
            "Chế độ import không hợp lệ."
        );

    }

    return {

        valid:
            errors.length === 0,

        errors

    };

}