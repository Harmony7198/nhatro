/**
 * @file seed-data.js
 * @description Dữ liệu mẫu cho RoomMate.
 */

import {
  ROOM_STATUS,
  TENANT_STATUS
} from "../constants/statuses.js";

/* ===========================
 * PHÒNG
 * =========================== */

export const seedRooms = [
  {
    id: "ROOM001",
    code: "P101",
    name: "Phòng 101",
    floor: 1,
    area: 20,
    maxOccupants: 2,
    rentPrice: 3500000,
    status: ROOM_STATUS.OCCUPIED,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM002",
    code: "P102",
    name: "Phòng 102",
    floor: 1,
    area: 22,
    maxOccupants: 2,
    rentPrice: 3600000,
    status: ROOM_STATUS.OCCUPIED,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM003",
    code: "P103",
    name: "Phòng 103",
    floor: 1,
    area: 18,
    maxOccupants: 2,
    rentPrice: 3200000,
    status: ROOM_STATUS.AVAILABLE,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM004",
    code: "P104",
    name: "Phòng 104",
    floor: 1,
    area: 20,
    maxOccupants: 2,
    rentPrice: 3300000,
    status: ROOM_STATUS.MAINTENANCE,
    note: "Đang sửa máy lạnh",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM005",
    code: "P201",
    name: "Phòng 201",
    floor: 2,
    area: 25,
    maxOccupants: 3,
    rentPrice: 4200000,
    status: ROOM_STATUS.OCCUPIED,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM006",
    code: "P202",
    name: "Phòng 202",
    floor: 2,
    area: 25,
    maxOccupants: 3,
    rentPrice: 4200000,
    status: ROOM_STATUS.OCCUPIED,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM007",
    code: "P203",
    name: "Phòng 203",
    floor: 2,
    area: 24,
    maxOccupants: 2,
    rentPrice: 3900000,
    status: ROOM_STATUS.AVAILABLE,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM008",
    code: "P204",
    name: "Phòng 204",
    floor: 2,
    area: 28,
    maxOccupants: 3,
    rentPrice: 4500000,
    status: ROOM_STATUS.OCCUPIED,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM009",
    code: "P301",
    name: "Phòng 301",
    floor: 3,
    area: 30,
    maxOccupants: 4,
    rentPrice: 5200000,
    status: ROOM_STATUS.OCCUPIED,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "ROOM010",
    code: "P302",
    name: "Phòng 302",
    floor: 3,
    area: 26,
    maxOccupants: 3,
    rentPrice: 4700000,
    status: ROOM_STATUS.MAINTENANCE,
    note: "Sơn lại phòng",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  }
];

/* ===========================
 * NGƯỜI THUÊ
 * =========================== */

export const seedTenants = [
  {
    id: "TENANT001",
    fullName: "Nguyễn Văn An",
    phone: "0901111111",
    email: "an@example.com",
    identityNumber: "079201000001",
    roomId: "ROOM001",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-01-10T08:00:00.000Z"
  },
  {
    id: "TENANT002",
    fullName: "Trần Thị Bình",
    phone: "0901111112",
    email: "binh@example.com",
    identityNumber: "079201000002",
    roomId: "ROOM001",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-11T08:00:00.000Z",
    updatedAt: "2026-01-11T08:00:00.000Z"
  },
  {
    id: "TENANT003",
    fullName: "Lê Minh Châu",
    phone: "0901111113",
    email: "chau@example.com",
    identityNumber: "079201000003",
    roomId: "ROOM002",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-12T08:00:00.000Z",
    updatedAt: "2026-01-12T08:00:00.000Z"
  },
  {
    id: "TENANT004",
    fullName: "Phạm Quốc Dũng",
    phone: "0901111114",
    email: "dung@example.com",
    identityNumber: "079201000004",
    roomId: "ROOM005",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-13T08:00:00.000Z",
    updatedAt: "2026-01-13T08:00:00.000Z"
  },
  {
    id: "TENANT005",
    fullName: "Hoàng Mai",
    phone: "0901111115",
    email: "mai@example.com",
    identityNumber: "079201000005",
    roomId: "ROOM005",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-14T08:00:00.000Z",
    updatedAt: "2026-01-14T08:00:00.000Z"
  },
  {
    id: "TENANT006",
    fullName: "Đỗ Thanh Hà",
    phone: "0901111116",
    email: "ha@example.com",
    identityNumber: "079201000006",
    roomId: "ROOM006",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-15T08:00:00.000Z",
    updatedAt: "2026-01-15T08:00:00.000Z"
  },
  {
    id: "TENANT007",
    fullName: "Võ Minh Khang",
    phone: "0901111117",
    email: "khang@example.com",
    identityNumber: "079201000007",
    roomId: "ROOM008",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-16T08:00:00.000Z",
    updatedAt: "2026-01-16T08:00:00.000Z"
  },
  {
    id: "TENANT008",
    fullName: "Ngô Thị Lan",
    phone: "0901111118",
    email: "lan@example.com",
    identityNumber: "079201000008",
    roomId: "ROOM009",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-17T08:00:00.000Z",
    updatedAt: "2026-01-17T08:00:00.000Z"
  },
  {
    id: "TENANT009",
    fullName: "Bùi Anh Tuấn",
    phone: "0901111119",
    email: "tuan@example.com",
    identityNumber: "079201000009",
    roomId: "ROOM009",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-18T08:00:00.000Z",
    updatedAt: "2026-01-18T08:00:00.000Z"
  },
  {
    id: "TENANT010",
    fullName: "Lý Ngọc Hân",
    phone: "0901111120",
    email: "han@example.com",
    identityNumber: "079201000010",
    roomId: "ROOM009",
    status: TENANT_STATUS.ACTIVE,
    createdAt: "2026-01-19T08:00:00.000Z",
    updatedAt: "2026-01-19T08:00:00.000Z"
  },
  {
    id: "TENANT011",
    fullName: "Phan Gia Huy",
    phone: "0901111121",
    email: "huy@example.com",
    identityNumber: "079201000011",
    roomId: null,
    status: TENANT_STATUS.INACTIVE,
    createdAt: "2026-01-20T08:00:00.000Z",
    updatedAt: "2026-01-20T08:00:00.000Z"
  },
  {
    id: "TENANT012",
    fullName: "Nguyễn Thị Yến",
    phone: "0901111122",
    email: "yen@example.com",
    identityNumber: "079201000012",
    roomId: null,
    status: TENANT_STATUS.INACTIVE,
    createdAt: "2026-01-21T08:00:00.000Z",
    updatedAt: "2026-01-21T08:00:00.000Z"
  },
  {
    id: "TENANT013",
    fullName: "Trương Đức Long",
    phone: "0901111123",
    email: "long@example.com",
    identityNumber: "079201000013",
    roomId: null,
    status: TENANT_STATUS.INACTIVE,
    createdAt: "2026-01-22T08:00:00.000Z",
    updatedAt: "2026-01-22T08:00:00.000Z"
  },
  {
    id: "TENANT014",
    fullName: "Lâm Hải Nam",
    phone: "0901111124",
    email: "nam@example.com",
    identityNumber: "079201000014",
    roomId: null,
    status: TENANT_STATUS.INACTIVE,
    createdAt: "2026-01-23T08:00:00.000Z",
    updatedAt: "2026-01-23T08:00:00.000Z"
  },
  {
    id: "TENANT015",
    fullName: "Huỳnh Mỹ Linh",
    phone: "0901111125",
    email: "linh@example.com",
    identityNumber: "079201000015",
    roomId: null,
    status: TENANT_STATUS.INACTIVE,
    createdAt: "2026-01-24T08:00:00.000Z",
    updatedAt: "2026-01-24T08:00:00.000Z"
  }
];

import { CONTRACT_STATUS } from "../constants/statuses.js";

/* ===========================
 * HỢP ĐỒNG
 * =========================== */

export const seedContracts = [
  {
    id: "CONTRACT001",
    contractNumber: "HD-2026-001",
    roomId: "ROOM001",
    tenantId: "TENANT001",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    rentPrice: 3500000,
    depositAmount: 3500000,
    status: CONTRACT_STATUS.ACTIVE,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "CONTRACT002",
    contractNumber: "HD-2026-002",
    roomId: "ROOM002",
    tenantId: "TENANT003",
    startDate: "2026-02-01",
    endDate: "2026-11-30",
    rentPrice: 3600000,
    depositAmount: 3600000,
    status: CONTRACT_STATUS.ACTIVE,
    note: "",
    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-02-01T08:00:00.000Z"
  },
  {
    id: "CONTRACT003",
    contractNumber: "HD-2026-003",
    roomId: "ROOM005",
    tenantId: "TENANT004",
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    rentPrice: 4200000,
    depositAmount: 4200000,
    status: CONTRACT_STATUS.ACTIVE,
    note: "Sắp hết hạn",
    createdAt: "2026-03-01T08:00:00.000Z",
    updatedAt: "2026-03-01T08:00:00.000Z"
  },
  {
    id: "CONTRACT004",
    contractNumber: "HD-2026-004",
    roomId: "ROOM006",
    tenantId: "TENANT006",
    startDate: "2026-03-15",
    endDate: "2026-12-31",
    rentPrice: 4200000,
    depositAmount: 4200000,
    status: CONTRACT_STATUS.ACTIVE,
    note: "",
    createdAt: "2026-03-15T08:00:00.000Z",
    updatedAt: "2026-03-15T08:00:00.000Z"
  },
  {
    id: "CONTRACT005",
    contractNumber: "HD-2026-005",
    roomId: "ROOM008",
    tenantId: "TENANT007",
    startDate: "2026-04-01",
    endDate: "2026-09-30",
    rentPrice: 4500000,
    depositAmount: 4500000,
    status: CONTRACT_STATUS.ACTIVE,
    note: "Sắp hết hạn",
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-01T08:00:00.000Z"
  },
  {
    id: "CONTRACT006",
    contractNumber: "HD-2026-006",
    roomId: "ROOM009",
    tenantId: "TENANT008",
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    rentPrice: 5200000,
    depositAmount: 5200000,
    status: CONTRACT_STATUS.ACTIVE,
    note: "",
    createdAt: "2026-01-15T08:00:00.000Z",
    updatedAt: "2026-01-15T08:00:00.000Z"
  },
  {
    id: "CONTRACT007",
    contractNumber: "HD-2025-007",
    roomId: "ROOM003",
    tenantId: "TENANT011",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    rentPrice: 3200000,
    depositAmount: 3200000,
    status: CONTRACT_STATUS.EXPIRED,
    note: "",
    createdAt: "2025-01-01T08:00:00.000Z",
    updatedAt: "2025-12-31T08:00:00.000Z"
  },
  {
    id: "CONTRACT008",
    contractNumber: "HD-2025-008",
    roomId: "ROOM007",
    tenantId: "TENANT012",
    startDate: "2025-03-01",
    endDate: "2025-08-31",
    rentPrice: 3900000,
    depositAmount: 3900000,
    status: CONTRACT_STATUS.TERMINATED,
    note: "Chấm dứt trước hạn",
    createdAt: "2025-03-01T08:00:00.000Z",
    updatedAt: "2025-08-15T08:00:00.000Z"
  }
];

/* ===========================
 * DỊCH VỤ
 * =========================== */

export const seedServiceConfigs = [
  {
    id: "SERVICE001",
    code: "ELECTRIC",
    name: "Điện",
    unit: "kWh",
    unitPrice: 3800,
    isMonthly: true,
    isActive: true,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "SERVICE002",
    code: "WATER",
    name: "Nước",
    unit: "m³",
    unitPrice: 18000,
    isMonthly: true,
    isActive: true,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "SERVICE003",
    code: "INTERNET",
    name: "Internet",
    unit: "tháng",
    unitPrice: 200000,
    isMonthly: true,
    isActive: true,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "SERVICE004",
    code: "PARKING",
    name: "Giữ xe",
    unit: "xe",
    unitPrice: 100000,
    isMonthly: true,
    isActive: true,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "SERVICE005",
    code: "TRASH",
    name: "Rác",
    unit: "tháng",
    unitPrice: 50000,
    isMonthly: true,
    isActive: true,
    note: "",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  },
  {
    id: "SERVICE006",
    code: "CLEANING",
    name: "Vệ sinh",
    unit: "tháng",
    unitPrice: 150000,
    isMonthly: false,
    isActive: true,
    note: "Dịch vụ tùy chọn",
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z"
  }
];
import { INVOICE_STATUS } from "../constants/statuses.js";
import { PAYMENT_METHOD } from "../constants/payment-methods.js";

/* ===========================
 * CHỈ SỐ ĐIỆN NƯỚC
 * =========================== */

export const seedMeterReadings = [
  // Tháng 5/2026
  {
    id: "METER001",
    roomId: "ROOM001",
    month: "2026-05",
    electricityPrevious: 1200,
    electricityCurrent: 1325,
    waterPrevious: 180,
    waterCurrent: 192,
    readingDate: "2026-05-30",
    createdAt: "2026-05-30T08:00:00.000Z",
    updatedAt: "2026-05-30T08:00:00.000Z"
  },
  {
    id: "METER002",
    roomId: "ROOM002",
    month: "2026-05",
    electricityPrevious: 950,
    electricityCurrent: 1048,
    waterPrevious: 150,
    waterCurrent: 160,
    readingDate: "2026-05-30",
    createdAt: "2026-05-30T08:00:00.000Z",
    updatedAt: "2026-05-30T08:00:00.000Z"
  },
  {
    id: "METER003",
    roomId: "ROOM005",
    month: "2026-05",
    electricityPrevious: 1580,
    electricityCurrent: 1710,
    waterPrevious: 250,
    waterCurrent: 266,
    readingDate: "2026-05-30",
    createdAt: "2026-05-30T08:00:00.000Z",
    updatedAt: "2026-05-30T08:00:00.000Z"
  },

  // Tháng 6/2026
  {
    id: "METER004",
    roomId: "ROOM001",
    month: "2026-06",
    electricityPrevious: 1325,
    electricityCurrent: 1456,
    waterPrevious: 192,
    waterCurrent: 205,
    readingDate: "2026-06-30",
    createdAt: "2026-06-30T08:00:00.000Z",
    updatedAt: "2026-06-30T08:00:00.000Z"
  },
  {
    id: "METER005",
    roomId: "ROOM002",
    month: "2026-06",
    electricityPrevious: 1048,
    electricityCurrent: 1145,
    waterPrevious: 160,
    waterCurrent: 170,
    readingDate: "2026-06-30",
    createdAt: "2026-06-30T08:00:00.000Z",
    updatedAt: "2026-06-30T08:00:00.000Z"
  },
  {
    id: "METER006",
    roomId: "ROOM005",
    month: "2026-06",
    electricityPrevious: 1710,
    electricityCurrent: 1848,
    waterPrevious: 266,
    waterCurrent: 282,
    readingDate: "2026-06-30",
    createdAt: "2026-06-30T08:00:00.000Z",
    updatedAt: "2026-06-30T08:00:00.000Z"
  },

  // Tháng 7/2026
  {
    id: "METER007",
    roomId: "ROOM001",
    month: "2026-07",
    electricityPrevious: 1456,
    electricityCurrent: 1598,
    waterPrevious: 205,
    waterCurrent: 218,
    readingDate: "2026-07-30",
    createdAt: "2026-07-30T08:00:00.000Z",
    updatedAt: "2026-07-30T08:00:00.000Z"
  },
  {
    id: "METER008",
    roomId: "ROOM002",
    month: "2026-07",
    electricityPrevious: 1145,
    electricityCurrent: 1260,
    waterPrevious: 170,
    waterCurrent: 182,
    readingDate: "2026-07-30",
    createdAt: "2026-07-30T08:00:00.000Z",
    updatedAt: "2026-07-30T08:00:00.000Z"
  },
  {
    id: "METER009",
    roomId: "ROOM005",
    month: "2026-07",
    electricityPrevious: 1848,
    electricityCurrent: 1985,
    waterPrevious: 282,
    waterCurrent: 299,
    readingDate: "2026-07-30",
    createdAt: "2026-07-30T08:00:00.000Z",
    updatedAt: "2026-07-30T08:00:00.000Z"
  }
];

/* ===========================
 * HÓA ĐƠN
 * =========================== */

export const seedInvoices = [
  {
    id: "INV001",
    contractId: "CONTRACT001",
    roomId: "ROOM001",
    month: "2026-07",
    issueDate: "2026-07-01",
    dueDate: "2026-07-10",
    rentAmount: 3500000,
    electricityAmount: 539600,
    waterAmount: 234000,
    serviceAmount: 350000,
    totalAmount: 4623600,
    paidAmount: 4623600,
    balanceAmount: 0,
    status: INVOICE_STATUS.PAID,
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-05T10:00:00.000Z"
  },
  {
    id: "INV002",
    contractId: "CONTRACT002",
    roomId: "ROOM002",
    month: "2026-07",
    issueDate: "2026-07-01",
    dueDate: "2026-07-10",
    rentAmount: 3600000,
    electricityAmount: 437000,
    waterAmount: 216000,
    serviceAmount: 350000,
    totalAmount: 4603000,
    paidAmount: 2000000,
    balanceAmount: 2603000,
    status: INVOICE_STATUS.PARTIALLY_PAID,
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-08T08:00:00.000Z"
  },
  {
    id: "INV003",
    contractId: "CONTRACT003",
    roomId: "ROOM005",
    month: "2026-07",
    issueDate: "2026-07-01",
    dueDate: "2026-07-10",
    rentAmount: 4200000,
    electricityAmount: 520600,
    waterAmount: 306000,
    serviceAmount: 350000,
    totalAmount: 5376600,
    paidAmount: 0,
    balanceAmount: 5376600,
    status: INVOICE_STATUS.UNPAID,
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "INV004",
    contractId: "CONTRACT004",
    roomId: "ROOM006",
    month: "2026-06",
    issueDate: "2026-06-01",
    dueDate: "2026-06-10",
    rentAmount: 4200000,
    electricityAmount: 480000,
    waterAmount: 252000,
    serviceAmount: 350000,
    totalAmount: 5282000,
    paidAmount: 0,
    balanceAmount: 5282000,
    status: INVOICE_STATUS.OVERDUE,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-01T08:00:00.000Z"
  },
  {
    id: "INV005",
    contractId: "CONTRACT005",
    roomId: "ROOM008",
    month: "2026-07",
    issueDate: "2026-07-01",
    dueDate: "2026-07-10",
    rentAmount: 4500000,
    electricityAmount: 510000,
    waterAmount: 288000,
    serviceAmount: 350000,
    totalAmount: 5648000,
    paidAmount: 5648000,
    balanceAmount: 0,
    status: INVOICE_STATUS.PAID,
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-06T08:00:00.000Z"
  },

  {
    id: "INV006",
    contractId: "CONTRACT006",
    roomId: "ROOM009",
    month: "2026-07",
    issueDate: "2026-07-01",
    dueDate: "2026-07-10",
    rentAmount: 5200000,
    electricityAmount: 630000,
    waterAmount: 324000,
    serviceAmount: 350000,
    totalAmount: 6504000,
    paidAmount: 6504000,
    balanceAmount: 0,
    status: INVOICE_STATUS.PAID,
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-07T08:00:00.000Z"
  },

  {
    id: "INV007",
    contractId: "CONTRACT001",
    roomId: "ROOM001",
    month: "2026-06",
    issueDate: "2026-06-01",
    dueDate: "2026-06-10",
    rentAmount: 3500000,
    electricityAmount: 497800,
    waterAmount: 234000,
    serviceAmount: 350000,
    totalAmount: 4581800,
    paidAmount: 4581800,
    balanceAmount: 0,
    status: INVOICE_STATUS.PAID,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-05T08:00:00.000Z"
  },
  {
    id: "INV008",
    contractId: "CONTRACT002",
    roomId: "ROOM002",
    month: "2026-06",
    issueDate: "2026-06-01",
    dueDate: "2026-06-10",
    rentAmount: 3600000,
    electricityAmount: 368600,
    waterAmount: 180000,
    serviceAmount: 350000,
    totalAmount: 4498600,
    paidAmount: 0,
    balanceAmount: 4498600,
    status: INVOICE_STATUS.OVERDUE,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-01T08:00:00.000Z"
  },
  {
    id: "INV009",
    contractId: "CONTRACT003",
    roomId: "ROOM005",
    month: "2026-06",
    issueDate: "2026-06-01",
    dueDate: "2026-06-10",
    rentAmount: 4200000,
    electricityAmount: 494000,
    waterAmount: 288000,
    serviceAmount: 350000,
    totalAmount: 5332000,
    paidAmount: 3000000,
    balanceAmount: 2332000,
    status: INVOICE_STATUS.PARTIALLY_PAID,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-08T08:00:00.000Z"
  },
  {
    id: "INV010",
    contractId: "CONTRACT005",
    roomId: "ROOM008",
    month: "2026-06",
    issueDate: "2026-06-01",
    dueDate: "2026-06-10",
    rentAmount: 4500000,
    electricityAmount: 502000,
    waterAmount: 288000,
    serviceAmount: 350000,
    totalAmount: 5640000,
    paidAmount: 0,
    balanceAmount: 5640000,
    status: INVOICE_STATUS.UNPAID,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-01T08:00:00.000Z"
  }
];

/* ===========================
 * THANH TOÁN
 * =========================== */

export const seedPayments = [
  {
    id: "PAY001",
    invoiceId: "INV001",
    paymentDate: "2026-07-05",
    amount: 4623600,
    method: PAYMENT_METHOD.BANK_TRANSFER,
    note: ""
  },
  {
    id: "PAY002",
    invoiceId: "INV002",
    paymentDate: "2026-07-08",
    amount: 2000000,
    method: PAYMENT_METHOD.CASH,
    note: ""
  },
  {
    id: "PAY003",
    invoiceId: "INV005",
    paymentDate: "2026-07-06",
    amount: 5648000,
    method: PAYMENT_METHOD.BANK_TRANSFER,
    note: ""
  },
  {
    id: "PAY004",
    invoiceId: "INV006",
    paymentDate: "2026-07-07",
    amount: 6504000,
    method: PAYMENT_METHOD.BANK_TRANSFER,
    note: ""
  },
  {
    id: "PAY005",
    invoiceId: "INV007",
    paymentDate: "2026-06-05",
    amount: 4581800,
    method: PAYMENT_METHOD.CASH,
    note: ""
  },
  {
    id: "PAY006",
    invoiceId: "INV009",
    paymentDate: "2026-06-08",
    amount: 3000000,
    method: PAYMENT_METHOD.CASH,
    note: ""
  },
  {
    id: "PAY007",
    invoiceId: "INV001",
    paymentDate: "2026-07-05",
    amount: 0,
    method: PAYMENT_METHOD.OTHER,
    note: "Biên lai điện tử"
  },
  {
    id: "PAY008",
    invoiceId: "INV006",
    paymentDate: "2026-07-07",
    amount: 0,
    method: PAYMENT_METHOD.OTHER,
    note: "Xác nhận giao dịch"
  }
];

/* ===========================
 * TỔNG HỢP
 * =========================== */

export const SEED_DATA = Object.freeze({
  rooms: seedRooms,
  tenants: seedTenants,
  contracts: seedContracts,
  meterReadings: seedMeterReadings,
  serviceConfigs: seedServiceConfigs,
  invoices: seedInvoices,
  payments: seedPayments
});