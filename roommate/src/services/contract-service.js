import {
  CONTRACT_STATUS,
  ROOM_STATUS
} from "../constants/statuses.js";

/**
 * @file contract-service.js
 * @description Service quản lý hợp đồng.
 */

import { STORAGE_KEYS } from "../constants/storage-keys.js";
import * as StorageService from "./storage-service.js";
import * as RoomService from "./room-service.js";

import {
  validateContract
} from "../business/contract-validator.js";

import {
  determineContractStatus,
  isContractActive,
  isContractExpiringSoon,
  hasOverlappingContract
} from "../business/contract-utils.js";

/**
 * Lấy toàn bộ hợp đồng.
 *
 * @returns {Array}
 */
export function getContracts() {
  return StorageService.getAll(
    STORAGE_KEYS.CONTRACTS
  );
}

/**
 * Lấy hợp đồng theo ID.
 *
 * @param {string} id
 * @returns {Object}
 */
export function getContractById(id) {

  if (!id) {
    throw new Error("ID hợp đồng là bắt buộc.");
  }

  const contract =
    StorageService.getById(
      STORAGE_KEYS.CONTRACTS,
      id
    );

  if (!contract) {
    throw new Error(
      "Không tìm thấy hợp đồng."
    );
  }

  return contract;

}

/**
 * Tìm kiếm hợp đồng.
 *
 * @param {string} keyword
 * @returns {Array}
 */
export function searchContracts(
  keyword = ""
) {

  const text =
    keyword.trim().toLowerCase();

  return getContracts().filter(
    (contract) => {

      return (
        (contract.contractNumber ?? "")
          .toLowerCase()
          .includes(text) ||

        (contract.roomCode ?? "")
          .toLowerCase()
          .includes(text) ||

        (contract.tenantName ?? "")
          .toLowerCase()
          .includes(text)
      );

    }
  );

}

/**
 * Lọc hợp đồng.
 *
 * filters:
 * {
 *    status,
 *    roomId,
 *    tenantId
 * }
 *
 * @param {Object} filters
 * @returns {Array}
 */
export function filterContracts(
  filters = {}
) {

  let contracts =
    getContracts();

  if (filters.status) {

    contracts =
      contracts.filter(
        (contract) =>
          determineContractStatus(contract)
          === filters.status
      );

  }

  if (filters.roomId) {

    contracts =
      contracts.filter(
        (contract) =>
          contract.roomId ===
          filters.roomId
      );

  }

  if (filters.tenantId) {

    contracts =
      contracts.filter(
        (contract) =>
          contract.tenantId ===
          filters.tenantId
      );

  }

  return contracts;

}

/**
 * Lấy hợp đồng hiệu lực của phòng.
 *
 * @param {string} roomId
 * @returns {Object|null}
 */
export function getActiveContractByRoom(
  roomId
) {

  if (!roomId) {
    throw new Error(
      "roomId là bắt buộc."
    );
  }

  const contracts =
    getContracts();

  return (
    contracts.find(
      (contract) =>
        contract.roomId === roomId &&
        isContractActive(contract)
    ) ?? null
  );

}

/**
 * Kiểm tra phòng có hợp đồng trùng.
 *
 * @param {Object} contract
 */
function ensureNoOverlap(
  contract
) {

  const contracts =
    getContracts();

  if (
    hasOverlappingContract(
      contract,
      contracts
    )
  ) {

    throw new Error(
      "Phòng đã có hợp đồng trong khoảng thời gian này."
    );

  }

}

/**
 * Validate trước khi lưu.
 *
 * @param {Object} contract
 */
function validateBeforeSave(
  contract
) {

  const room =
    RoomService.getRoomById(
      contract.roomId
    );

  validateContract(
    contract,
    {
      room,
      existingContracts:
        getContracts()
    }
  );

}

/**
 * Cập nhật trạng thái hợp đồng.
 *
 * @param {Object} contract
 * @returns {Object}
 */
function normalizeStatus(
  contract
) {

  return {
    ...contract,
    status:
      determineContractStatus(
        contract
      )
  };

}

/**
 * Tạo hợp đồng mới.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function createContract(data) {
  const room = RoomService.getRoomById(data.roomId);

  const contract = normalizeStatus({
    ...data,
    rentPrice:
      Number.isFinite(Number(data.rentPrice))
        ? Number(data.rentPrice)
        : room.rentPrice
  });

  validateBeforeSave(contract);

  ensureNoOverlap(contract);

  return StorageService.create(
    STORAGE_KEYS.CONTRACTS,
    contract
  );
}

/**
 * Cập nhật hợp đồng.
 *
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 */
export function updateContract(id, data) {
  const current = getContractById(id);

  if (
    determineContractStatus(current) ===
    CONTRACT_STATUS.EXPIRED
  ) {
    throw new Error(
      "Không được sửa hợp đồng đã kết thúc."
    );
  }

  if (
    current.status ===
    CONTRACT_STATUS.CANCELLED
  ) {
    throw new Error(
      "Không được sửa hợp đồng đã hủy."
    );
  }

  const updated = normalizeStatus({
    ...current,
    ...data,
    id
  });

  validateBeforeSave(updated);

  ensureNoOverlap(updated);

  return StorageService.update(
    STORAGE_KEYS.CONTRACTS,
    id,
    updated
  );
}

/**
 * Kích hoạt hợp đồng.
 *
 * @param {string} id
 * @returns {Object}
 */
export function activateContract(id) {
  const contract = getContractById(id);

  if (
    determineContractStatus(contract) ===
    CONTRACT_STATUS.EXPIRED
  ) {
    throw new Error(
      "Hợp đồng đã hết hạn."
    );
  }

  const room = RoomService.getRoomById(
    contract.roomId
  );

  const activeContract =
    getActiveContractByRoom(
      room.id
    );

  if (
    activeContract &&
    activeContract.id !== id
  ) {
    throw new Error(
      "Phòng đã có hợp đồng đang hiệu lực."
    );
  }

  // Chuẩn bị dữ liệu trước khi ghi
  const contractChanges = {
    status: CONTRACT_STATUS.ACTIVE
  };

  const roomChanges = {
    status: ROOM_STATUS.OCCUPIED
  };

  try {
    const updatedContract =
      StorageService.update(
        STORAGE_KEYS.CONTRACTS,
        id,
        contractChanges
      );

    try {
      RoomService.updateRoom(
        room.id,
        roomChanges
      );

      return updatedContract;
    } catch (roomError) {
      // Rollback nếu cập nhật phòng thất bại
      StorageService.update(
        STORAGE_KEYS.CONTRACTS,
        id,
        {
          status: contract.status
        }
      );

      throw roomError;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Gia hạn hợp đồng.
 *
 * @param {string} id
 * @param {string} newEndDate
 * @returns {Object}
 */
export function extendContract(id, newEndDate) {
  const contract = getContractById(id);

  if (
    determineContractStatus(contract) ===
    CONTRACT_STATUS.EXPIRED
  ) {
    throw new Error(
      "Không thể gia hạn hợp đồng đã hết hạn."
    );
  }

  if (
    contract.status ===
    CONTRACT_STATUS.CANCELLED
  ) {
    throw new Error(
      "Không thể gia hạn hợp đồng đã hủy."
    );
  }

  const updated = {
    ...contract,
    endDate: newEndDate
  };

  validateBeforeSave(updated);

  ensureNoOverlap(updated);

  return StorageService.update(
    STORAGE_KEYS.CONTRACTS,
    id,
    {
      endDate: newEndDate
    }
  );
}

/**
 * Kết thúc hợp đồng.
 *
 * @param {string} id
 * @param {string} actualEndDate
 * @returns {Object}
 */
export function endContract(
  id,
  actualEndDate = new Date().toISOString()
) {

  const contract =
    getContractById(id);

  if (
    contract.status ===
    CONTRACT_STATUS.CANCELLED
  ) {
    throw new Error(
      "Hợp đồng đã bị hủy."
    );
  }

  const updated =
    StorageService.update(
      STORAGE_KEYS.CONTRACTS,
      id,
      {
        endDate: actualEndDate,
        status: CONTRACT_STATUS.EXPIRED
      }
    );

  const active =
    getContracts().some(
      (item) =>
        item.id !== id &&
        item.roomId === contract.roomId &&
        isContractActive(item)
    );

  if (!active) {

    RoomService.updateRoom(
      contract.roomId,
      {
        status:
          ROOM_STATUS.AVAILABLE
      }
    );

  }

  return updated;

}

/**
 * Hủy hợp đồng.
 *
 * @param {string} id
 * @returns {Object}
 */
export function cancelContract(id) {

  const contract =
    getContractById(id);

  if (
    contract.status ===
    CONTRACT_STATUS.CANCELLED
  ) {
    throw new Error(
      "Hợp đồng đã bị hủy."
    );
  }

  const updated =
    StorageService.update(
      STORAGE_KEYS.CONTRACTS,
      id,
      {
        status:
          CONTRACT_STATUS.CANCELLED
      }
    );

  const active =
    getContracts().some(
      (item) =>
        item.id !== id &&
        item.roomId === contract.roomId &&
        isContractActive(item)
    );

  if (!active) {

    RoomService.updateRoom(
      contract.roomId,
      {
        status:
          ROOM_STATUS.AVAILABLE
      }
    );

  }

  return updated;

}

/**
 * Lấy danh sách hợp đồng sắp hết hạn.
 *
 * @param {number} days
 * @returns {Array}
 */
export function getExpiringContracts(
  days = 30
) {

  return getContracts().filter(
    (contract) =>
      isContractExpiringSoon(
        contract,
        new Date(),
        days
      )
  );

}