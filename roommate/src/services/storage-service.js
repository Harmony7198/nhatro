
import { STORAGE_KEYS } from "../constants/storage-keys.js";
/**
 * @file storage-service.js
 * @description Storage Service dùng chung cho RoomMate.
 */

/**
 * Chuyển object thành deep clone.
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepClone(value) {
  return structuredClone(value);
}

/**
 * Lấy thời gian hiện tại theo ISO.
 *
 * @returns {string}
 */
function getCurrentIsoDateTime() {
  return new Date().toISOString();
}

/**
 * Đọc dữ liệu từ LocalStorage.
 *
 * @param {string} key
 * @returns {Array}
 *
 * @throws {Error}
 */
function read(key) {
  if (typeof key !== "string" || !key.trim()) {
    throw new Error("Storage key không hợp lệ.");
  }

  const raw = localStorage.getItem(key);

  if (raw === null) {
    return [];
  }

  const data = safeParse(raw, []);

  if (!Array.isArray(data)) {
    throw new Error(`Dữ liệu của "${key}" phải là một mảng.`);
  }

  return deepClone(data);
}

/**
 * Ghi dữ liệu xuống LocalStorage.
 *
 * @param {string} key
 * @param {Array} data
 *
 * @throws {Error}
 */
function write(key, data) {
  if (!Array.isArray(data)) {
    throw new Error("Dữ liệu lưu phải là mảng.");
  }

  localStorage.setItem(
    key,
    JSON.stringify(deepClone(data))
  );
}

/**
 * Parse JSON an toàn.
 *
 * @template T
 * @param {string} value
 * @param {T} fallback
 * @returns {T}
 */
export function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Lấy toàn bộ dữ liệu.
 *
 * @param {string} key
 * @returns {Array}
 */
export function getAll(key) {
  return read(key);
}

/**
 * Lấy theo ID.
 *
 * @param {string} key
 * @param {string} id
 * @returns {Object|null}
 *
 * @throws {Error}
 */
export function getById(key, id) {
if (
  typeof newItem.id !== "string" ||
  !newItem.id.trim()
) {
  newItem.id =
    globalThis.crypto?.randomUUID?.() ??
    `id-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
}

  const items = read(key);

  const item = items.find((item) => item.id === id);

  return item ? deepClone(item) : null;
}

/**
 * Kiểm tra dữ liệu tồn tại theo điều kiện.
 *
 * @param {string} key
 * @param {(item:Object)=>boolean} predicate
 * @returns {boolean}
 *
 * @throws {Error}
 */
export function exists(key, predicate) {
  if (typeof predicate !== "function") {
    throw new Error("Predicate phải là function.");
  }

  return read(key).some(predicate);
}

/**
 * Helper dùng cho các hàm CRUD ở phần sau.
 */
export const storageInternal = Object.freeze({
  read,
  write,
  deepClone,
  getCurrentIsoDateTime
});

/**
 * Sinh ID đơn giản.
 *
 * @returns {string}
 */
function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

/**
 * Tạo mới một bản ghi.
 *
 * @param {string} key
 * @param {Object} item
 * @returns {Object}
 */
export function create(key, item) {

  if (
    item === null ||
    typeof item !== "object" ||
    Array.isArray(item)
  ) {
    throw new Error("Item phải là object.");
  }

  const items =
    storageInternal.read(key);

  const newItem =
    storageInternal.deepClone(item);

  // Nếu chưa có ID thì tự sinh
  if (
    typeof newItem.id !== "string" ||
    !newItem.id.trim()
  ) {

    let id;

    do {
      id = generateId();
    } while (
      items.some(
        (value) => value.id === id
      )
    );

    newItem.id = id;

  } else {

    const duplicated =
      items.some(
        (value) =>
          value.id === newItem.id
      );

    if (duplicated) {
      throw new Error(
        `ID "${newItem.id}" đã tồn tại.`
      );
    }

  }

  const now =
    storageInternal.getCurrentIsoDateTime();

  newItem.createdAt ??= now;
  newItem.updatedAt = now;

  items.push(newItem);

  storageInternal.write(
    key,
    items
  );

  return storageInternal.deepClone(
    newItem
  );

}

/**
 * Cập nhật bản ghi.
 *
 * Không cho phép thay đổi:
 * - id
 * - createdAt
 *
 * @param {string} key
 * @param {string} id
 * @param {Object} changes
 * @returns {Object}
 *
 * @throws {Error}
 */
export function update(key, id, changes) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("ID không hợp lệ.");
  }

  if (
    changes === null ||
    typeof changes !== "object" ||
    Array.isArray(changes)
  ) {
    throw new Error("Changes phải là object.");
  }

  const items = storageInternal.read(key);

  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Không tìm thấy ID "${id}".`);
  }

  const currentItem = items[index];

  const updatedItem = {
    ...currentItem,
    ...storageInternal.deepClone(changes),
    id: currentItem.id,
    createdAt: currentItem.createdAt,
    updatedAt: storageInternal.getCurrentIsoDateTime()
  };

  items[index] = updatedItem;

  storageInternal.write(key, items);

  return storageInternal.deepClone(updatedItem);
}

/**
 * Xóa bản ghi theo ID.
 *
 * @param {string} key
 * @param {string} id
 * @returns {boolean}
 *
 * @throws {Error}
 */
export function remove(key, id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("ID không hợp lệ.");
  }

  const items = storageInternal.read(key);

  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Không tìm thấy ID "${id}".`);
  }

  items.splice(index, 1);

  storageInternal.write(key, items);

  return true;
}

/**
 * Thay thế toàn bộ collection.
 *
 * @param {string} key
 * @param {Array} items
 * @returns {Array}
 *
 * @throws {Error}
 */
export function replaceAll(key, items) {
  if (!Array.isArray(items)) {
    throw new Error("Items phải là mảng.");
  }

  const cloned = storageInternal.deepClone(items);

  const ids = new Set();

  cloned.forEach((item, index) => {
    if (
      item === null ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(`Phần tử tại vị trí ${index} không hợp lệ.`);
    }

    if (typeof item.id !== "string" || !item.id.trim()) {
      throw new Error(`Phần tử tại vị trí ${index} thiếu ID.`);
    }

    if (ids.has(item.id)) {
      throw new Error(`ID "${item.id}" bị trùng.`);
    }

    ids.add(item.id);
  });

  storageInternal.write(key, cloned);

  return storageInternal.deepClone(cloned);
}

/**
 * Xóa một collection.
 *
 * @param {string} key
 */
export function clearKey(key) {
  if (typeof key !== "string" || !key.trim()) {
    throw new Error("Storage key không hợp lệ.");
  }

  localStorage.removeItem(key);
}

/**
 * Xóa toàn bộ LocalStorage.
 */
export function clearAll() {
  localStorage.clear();
}

/**
 * Danh sách các storage key của RoomMate.
 */
const STORAGE_KEY_LIST = Object.freeze(
  Object.values(STORAGE_KEYS)
);

/**
 * Export toàn bộ dữ liệu của RoomMate.
 *
 * @returns {Object}
 */
export function exportAll() {
  const result = {};

  STORAGE_KEY_LIST.forEach((key) => {
    result[key] = storageInternal.read(key);
  });

  return storageInternal.deepClone(result);
}

/**
 * Import toàn bộ dữ liệu.
 *
 * Chỉ import các collection được định nghĩa
 * trong STORAGE_KEYS.
 *
 * @param {Object} data
 *
 * @throws {Error}
 */
export function importAll(data) {
  if (
    data === null ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new Error("Dữ liệu import phải là object.");
  }

  STORAGE_KEY_LIST.forEach((key) => {
    if (!(key in data)) {
      return;
    }

    const value = data[key];

    if (!Array.isArray(value)) {
      throw new Error(
        `"${key}" phải là một mảng.`
      );
    }

    replaceAll(key, value);
  });
}