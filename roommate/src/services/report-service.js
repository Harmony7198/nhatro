calculateElectricUsage,
calculateWaterUsage,
calculateElectricUsageByRoom,
calculateElectricUsageOfMonth,
calculateWaterUsageOfMonth
calculateInvoiceStatusRatio,
calculatePaymentMethodRatio,
calculateExpiringContracts
/**
 * Báo cáo điện nước.
 *
 * @param {string|null} month
 * @returns {Object}
 */
export function getUtilitySummary(
  month = null
) {

  const readings =
    getMeterReadings();

  let electricUsage = 0;
  let waterUsage = 0;

  if (month) {

    electricUsage =
      calculateElectricUsageOfMonth(
        readings,
        month
      );

    waterUsage =
      calculateWaterUsageOfMonth(
        readings,
        month
      );

  } else {

    electricUsage =
      readings.reduce(
        (sum, reading) =>
          sum +
          Number(
            reading.electricUsage ?? 0
          ),
        0
      );

    waterUsage =
      readings.reduce(
        (sum, reading) =>
          sum +
          Number(
            reading.waterUsage ?? 0
          ),
        0
      );

  }

  return {

    electricUsage,

    waterUsage

  };

}

/**
 * Điện tiêu thụ theo phòng.
 *
 * @param {string|null} month
 * @returns {Array}
 */
export function getElectricUsageByRoom(
  month = null
) {

  return calculateElectricUsageByRoom(

    getMeterReadings(),

    month

  );

}

/**
 * Dữ liệu biểu đồ
 * điện theo tháng.
 *
 * @returns {Object}
 */
export function getElectricChartData() {

  const rows =
    calculateElectricUsage(
      getMeterReadings()
    );

  return {

    labels:
      rows.map(
        row => row.key
      ),

    data:
      rows.map(
        row => row.total
      )

  };

}

/**
 * Dữ liệu biểu đồ
 * nước theo tháng.
 *
 * @returns {Object}
 */
export function getWaterChartData() {

  const rows =
    calculateWaterUsage(
      getMeterReadings()
    );

  return {

    labels:
      rows.map(
        row => row.key
      ),

    data:
      rows.map(
        row => row.total
      )

  };

}

/**
 * Dữ liệu biểu đồ
 * điện theo phòng.
 *
 * @param {string|null} month
 * @returns {Object}
 */
export function getElectricUsageByRoomChartData(
  month = null
) {

  const rows =
    getElectricUsageByRoom(
      month
    );

  return {

    labels:
      rows.map(
        row => row.key
      ),

    data:
      rows.map(
        row => row.total
      )

  };

}










/**
 * @file report-service.js
 * @description Tổng hợp dữ liệu báo cáo cho Dashboard.
 */

import * as RoomService from "./room-service.js";
import * as ContractService from "./contract-service.js";
import * as InvoiceService from "./invoice-service.js";
import * as PaymentService from "./payment-service.js";
import * as MeterReadingService from "./meter-reading-service.js";
import * as DebtService from "./debt-service.js";

import {

  calculateOccupancyRate,

  calculateStatusSummary,

  countBy

} from "../business/report-calculator.js";

/**
 * Lấy toàn bộ phòng.
 *
 * @returns {Array}
 */
function getRooms() {

  return RoomService.getRooms();

}

/**
 * Lấy toàn bộ hợp đồng.
 *
 * @returns {Array}
 */
function getContracts() {

  return ContractService.getContracts();

}

/**
 * Lấy toàn bộ hóa đơn.
 *
 * @returns {Array}
 */
function getInvoices() {

  return InvoiceService.getInvoices();

}

/**
 * Lấy toàn bộ thanh toán.
 *
 * @returns {Array}
 */
function getPayments() {

  return PaymentService.getPayments();

}

/**
 * Lấy toàn bộ chỉ số điện nước.
 *
 * @returns {Array}
 */
function getMeterReadings() {

  return MeterReadingService.getReadings();

}

/**
 * Thống kê phòng.
 *
 * @returns {Object}
 */
export function getRoomSummary() {

  const rooms =
    getRooms();

  const totalRooms =
    rooms.length;

  const rentedRooms =
    countBy(

      rooms,

      room =>
        room.status ===
        "occupied"

    );

  const emptyRooms =
    countBy(

      rooms,

      room =>
        room.status ===
        "available"

    );

  const repairingRooms =
    countBy(

      rooms,

      room =>
        room.status ===
        "repair"

    );

  return {

    totalRooms,

    rentedRooms,

    emptyRooms,

    repairingRooms,

    occupancyRate:

      calculateOccupancyRate(

        rentedRooms,

        totalRooms

      ),

    roomStatus:

      calculateStatusSummary(
        rooms
      )

  };

}

/**
 * Thống kê người thuê.
 *
 * @returns {Object}
 */
export function getTenantSummary() {

  const contracts =
    getContracts()

      .filter(

        contract =>

          contract.status ===
          "active"

      );

  let totalTenants = 0;

  contracts.forEach(
    contract => {

      totalTenants +=
        Number(

          contract.personCount ??

          contract.numberOfPeople ??

          1

        );

    }
  );

  return {

    activeContracts:

      contracts.length,

    totalTenants

  };

}

import {

  calculateMonthlyRevenue,
  calculateMonthlyCollectedAmount,
  calculateRevenueOfMonth,
  calculateCollectedOfMonth,
  calculateTotalDebt,
  calculateOverdueInvoiceCount

} from "../business/report-calculator.js";

/**
 * Báo cáo tài chính.
 *
 * @param {string|null} month
 * @returns {Object}
 */
export function getFinancialSummary(
  month = null
) {

  const invoices =
    getInvoices();

  const payments =
    getPayments();

  const totalDebt =
    calculateTotalDebt(
      invoices
    );

  const overdueInvoiceCount =
    calculateOverdueInvoiceCount(
      invoices
    );

  let revenue = 0;
  let collected = 0;

  if (month) {

    revenue =
      calculateRevenueOfMonth(
        invoices,
        month
      );

    collected =
      calculateCollectedOfMonth(
        payments,
        month
      );

  } else {

    revenue =
      invoices.reduce(
        (sum, invoice) =>
          sum +
          Number(
            invoice.total ?? 0
          ),
        0
      );

    collected =
      payments.reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.amount ?? 0
          ),
        0
      );

  }

  return {

    revenue,

    collected,

    totalDebt,

    overdueInvoiceCount

  };

}

/**
 * Doanh thu theo tháng.
 *
 * Tổng giá trị hóa đơn.
 *
 * @returns {Array}
 */
export function getMonthlyRevenue() {

  return calculateMonthlyRevenue(
    getInvoices()
  );

}

/**
 * Tiền thực thu theo tháng.
 *
 * Tổng tiền khách đã thanh toán.
 *
 * @returns {Array}
 */
export function getMonthlyCollectedAmount() {

  return calculateMonthlyCollectedAmount(
    getPayments()
  );

}

/**
 * Chuẩn bị dữ liệu
 * cho biểu đồ doanh thu.
 *
 * @returns {Object}
 */
export function getRevenueChartData() {

  const rows =
    getMonthlyRevenue();

  return {

    labels:
      rows.map(
        row => row.key
      ),

    data:
      rows.map(
        row => row.total
      )

  };

}

/**
 * Chuẩn bị dữ liệu
 * cho biểu đồ thực thu.
 *
 * @returns {Object}
 */
export function getCollectedChartData() {

  const rows =
    getMonthlyCollectedAmount();

  return {

    labels:
      rows.map(
        row => row.key
      ),

    data:
      rows.map(
        row => row.total
      )

  };

}

/**
 * Thống kê hóa đơn.
 *
 * @returns {Object}
 */
export function getInvoiceSummary() {

  const invoices =
    getInvoices();

  return {

    totalInvoices:
      invoices.length,

    totalDebt:
      DebtService.getTotalDebt(),

    overdueInvoices:
      DebtService
        .getOverdueInvoices()
        .length,

    statusRatio:

      calculateInvoiceStatusRatio(
        invoices
      )

  };

}

/**
 * Thống kê thanh toán.
 *
 * @returns {Object}
 */
export function getPaymentMethodSummary() {

  const payments =
    getPayments();

  const methods =
    calculatePaymentMethodRatio(
      payments
    );

  return {

    totalPayments:
      payments.length,

    totalCollected:

      payments.reduce(

        (sum, payment) =>

          sum +
          Number(
            payment.amount ?? 0
          ),

        0

      ),

    methods

  };

}

/**
 * Thống kê hợp đồng.
 *
 * @param {number} days
 * @returns {Object}
 */
export function getContractSummary(
  days = 30
) {

  const contracts =
    getContracts();

  const expiringContracts =

    calculateExpiringContracts(

      contracts,

      days

    );

  return {

    totalContracts:
      contracts.length,

    activeContracts:

      contracts.filter(

        contract =>

          contract.status ===
          "active"

      ).length,

    expiringContracts,

    expiringCount:

      expiringContracts.length

  };

}

/**
 * Dữ liệu biểu đồ
 * trạng thái hóa đơn.
 *
 * @returns {Object}
 */
export function getInvoiceStatusChartData() {

  const rows =
    calculateInvoiceStatusRatio(
      getInvoices()
    );

  return {

    labels:

      rows.map(
        row =>
          row.status
      ),

    data:

      rows.map(
        row =>
          row.count
      )

  };

}

/**
 * Dữ liệu biểu đồ
 * phương thức thanh toán.
 *
 * @returns {Object}
 */
export function getPaymentMethodChartData() {

  const rows =
    calculatePaymentMethodRatio(
      getPayments()
    );

  return {

    labels:

      rows.map(
        row =>
          row.method
      ),

    data:

      rows.map(
        row =>
          row.amount
      )

  };

}

/**
 * Tổng hợp toàn bộ dữ liệu Dashboard.
 *
 * @param {string|null} month
 * @returns {Object}
 */
export function getDashboardSummary(
  month = null
) {

  return {

    generatedAt:
      new Date().toISOString(),

    month,

    rooms:
      getRoomSummary(),

    tenants:
      getTenantSummary(),

    finance:
      getFinancialSummary(
        month
      ),

    utilities:
      getUtilitySummary(
        month
      ),

    invoices:
      getInvoiceSummary(),

    payments:
      getPaymentMethodSummary(),

    contracts:
      getContractSummary()

  };

}

/**
 * Trả về toàn bộ dữ liệu biểu đồ.
 *
 * Không phụ thuộc Chart.js.
 *
 * @param {string|null} month
 * @returns {Object}
 */
export function getDashboardCharts(
  month = null
) {

  return {

    revenue:
      getRevenueChartData(),

    collected:
      getCollectedChartData(),

    electric:
      getElectricChartData(),

    water:
      getWaterChartData(),

    electricByRoom:
      getElectricUsageByRoomChartData(
        month
      ),

    invoiceStatus:
      getInvoiceStatusChartData(),

    paymentMethod:
      getPaymentMethodChartData()

  };

}

/**
 * API duy nhất dành cho Dashboard.
 *
 * @param {string|null} month
 * @returns {Object}
 */
export function getDashboardData(
  month = null
) {

  return {

    summary:
      getDashboardSummary(
        month
      ),

    charts:
      getDashboardCharts(
        month
      )

  };

}