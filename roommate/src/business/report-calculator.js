/**
 * @file report-calculator.js
 * @description Các hàm tính toán thống kê cho ReportService.
 */

/**
 * Kiểm tra mảng hợp lệ.
 *
 * @param {*} value
 * @returns {Array}
 */
function ensureArray(value) {

  return Array.isArray(value)
    ? value
    : [];

}

/**
 * Ép về số.
 *
 * @param {*} value
 * @returns {number}
 */
function toNumber(value) {

  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {

    return 0;

  }

  return number;

}

/**
 * Tính tổng theo selector.
 *
 * @template T
 * @param {Array<T>} items
 * @param {(item:T)=>number} selector
 * @returns {number}
 */
export function sumBy(
  items,
  selector
) {

  return ensureArray(items)
    .reduce(

      (sum, item) =>

        sum +
        toNumber(
          selector(item)
        ),

      0

    );

}

/**
 * Đếm theo điều kiện.
 *
 * @template T
 * @param {Array<T>} items
 * @param {(item:T)=>boolean} predicate
 * @returns {number}
 */
export function countBy(
  items,
  predicate
) {

  return ensureArray(items)
    .reduce(

      (count, item) =>

        predicate(item)
          ? count + 1
          : count,

      0

    );

}

/**
 * Gom nhóm dữ liệu.
 *
 * @template T
 * @param {Array<T>} items
 * @param {(item:T)=>string} keySelector
 * @returns {Map<string,Array<T>>}
 */
export function groupBy(
  items,
  keySelector
) {

  const groups =
    new Map();

  ensureArray(items)
    .forEach(item => {

      const key =
        String(
          keySelector(item)
        );

      if (
        !groups.has(key)
      ) {

        groups.set(
          key,
          []
        );

      }

      groups
        .get(key)
        .push(item);

    });

  return groups;

}

/**
 * Đếm số lượng theo nhóm.
 *
 * @template T
 * @param {Array<T>} items
 * @param {(item:T)=>string} keySelector
 * @returns {Array}
 */
export function countGroup(
  items,
  keySelector
) {

  return [
    ...groupBy(
      items,
      keySelector
    )
  ].map(

    ([key, values]) => ({

      key,

      count:
        values.length

    })

  );

}

/**
 * Tính tổng theo nhóm.
 *
 * @template T
 * @param {Array<T>} items
 * @param {(item:T)=>string} keySelector
 * @param {(item:T)=>number} valueSelector
 * @returns {Array}
 */
export function sumGroup(
  items,
  keySelector,
  valueSelector
) {

  return [
    ...groupBy(
      items,
      keySelector
    )
  ].map(

    ([key, values]) => ({

      key,

      total:
        sumBy(
          values,
          valueSelector
        )

    })

  );

}

/**
 * Tính tỷ lệ lấp đầy.
 *
 * @param {number} rentedRooms
 * @param {number} totalRooms
 * @returns {number}
 */
export function calculateOccupancyRate(
  rentedRooms,
  totalRooms
) {

  rentedRooms =
    toNumber(
      rentedRooms
    );

  totalRooms =
    toNumber(
      totalRooms
    );

  if (
    totalRooms <= 0
  ) {

    return 0;

  }

  return Number(

    (
      rentedRooms /
      totalRooms
    ) * 100

  ).toFixed(2);

}

/**
 * Đếm theo trạng thái.
 *
 * @param {Array} items
 * @param {string} field
 * @returns {Array}
 */
export function calculateStatusSummary(
  items,
  field = "status"
) {

  return countGroup(

    items,

    item =>
      item[field] ??
      "unknown"

  );

}


/**
 * Tính doanh thu hóa đơn theo tháng.
 * (Tổng giá trị hóa đơn, KHÔNG phải tiền đã thu)
 *
 * @param {Array} invoices
 * @returns {Array}
 */
export function calculateMonthlyRevenue(
  invoices
) {

  return sumGroup(

    ensureArray(invoices),

    invoice =>
      invoice.month ??
      invoice.invoiceMonth ??
      invoice.period ??
      "Unknown",

    invoice =>
      invoice.total ?? 0

  ).sort(
    (a, b) =>
      String(a.key)
        .localeCompare(
          String(b.key)
        )
  );

}

/**
 * Tính tiền thực thu theo tháng.
 *
 * @param {Array} payments
 * @returns {Array}
 */
export function calculateMonthlyCollectedAmount(
  payments
) {

  return sumGroup(

    ensureArray(payments),

    payment => {

      if (
        payment.paymentDate
      ) {

        return String(
          payment.paymentDate
        ).substring(0, 7);

      }

      return (
        payment.month ??
        "Unknown"
      );

    },

    payment =>
      payment.amount ?? 0

  ).sort(
    (a, b) =>
      String(a.key)
        .localeCompare(
          String(b.key)
        )
  );

}

/**
 * Tính tổng công nợ.
 *
 * @param {Array} invoices
 * @returns {number}
 */
export function calculateTotalDebt(
  invoices
) {

  return sumBy(

    ensureArray(invoices)

      .filter(
        invoice =>
          Number(
            invoice.remainingDebt ?? 0
          ) > 0
      ),

    invoice =>
      invoice.remainingDebt

  );

}

/**
 * Đếm số hóa đơn quá hạn.
 *
 * @param {Array} invoices
 * @param {Date|string} currentDate
 * @returns {number}
 */
export function calculateOverdueInvoiceCount(
  invoices,
  currentDate = new Date()
) {

  const today =
    new Date(
      currentDate
    );

  today.setHours(
    0,
    0,
    0,
    0
  );

  return countBy(

    ensureArray(invoices),

    invoice => {

      if (
        Number(
          invoice.remainingDebt ?? 0
        ) <= 0
      ) {

        return false;

      }

      if (
        !invoice.dueDate
      ) {

        return false;

      }

      const due =
        new Date(
          invoice.dueDate
        );

      if (
        Number.isNaN(
          due.getTime()
        )
      ) {

        return false;

      }

      due.setHours(
        0,
        0,
        0,
        0
      );

      return due < today;

    }

  );

}

/**
 * Tính doanh thu của một tháng.
 *
 * @param {Array} invoices
 * @param {string} month
 * @returns {number}
 */
export function calculateRevenueOfMonth(
  invoices,
  month
) {

  return sumBy(

    ensureArray(invoices)

      .filter(
        invoice =>

          (
            invoice.month ??
            invoice.invoiceMonth ??
            invoice.period
          ) === month
      ),

    invoice =>
      invoice.total

  );

}

/**
 * Tính tiền thực thu của một tháng.
 *
 * @param {Array} payments
 * @param {string} month
 * @returns {number}
 */
export function calculateCollectedOfMonth(
  payments,
  month
) {

  return sumBy(

    ensureArray(payments)

      .filter(payment => {

        const paymentMonth =

          payment.paymentDate
            ? String(
                payment.paymentDate
              ).substring(0, 7)
            : payment.month;

        return (
          paymentMonth ===
          month
        );

      }),

    payment =>
      payment.amount

  );

}


/**
 * Tổng điện tiêu thụ theo tháng.
 *
 * @param {Array} meterReadings
 * @returns {Array}
 */
export function calculateElectricUsage(
  meterReadings
) {

  return sumGroup(

    ensureArray(meterReadings),

    reading =>
      reading.month ??
      reading.period ??
      "Unknown",

    reading =>
      reading.electricUsage ?? 0

  ).sort(
    (a, b) =>
      String(a.key)
        .localeCompare(String(b.key))
  );

}

/**
 * Tổng nước tiêu thụ theo tháng.
 *
 * @param {Array} meterReadings
 * @returns {Array}
 */
export function calculateWaterUsage(
  meterReadings
) {

  return sumGroup(

    ensureArray(meterReadings),

    reading =>
      reading.month ??
      reading.period ??
      "Unknown",

    reading =>
      reading.waterUsage ?? 0

  ).sort(
    (a, b) =>
      String(a.key)
        .localeCompare(String(b.key))
  );

}

/**
 * Điện tiêu thụ theo phòng.
 *
 * @param {Array} meterReadings
 * @param {string|null} month
 * @returns {Array}
 */
export function calculateElectricUsageByRoom(
  meterReadings,
  month = null
) {

  let readings =
    ensureArray(
      meterReadings
    );

  if (month) {

    readings =
      readings.filter(
        reading =>

          (
            reading.month ??
            reading.period
          ) === month
      );

  }

  return sumGroup(

    readings,

    reading =>
      reading.roomId ??
      "Unknown",

    reading =>
      reading.electricUsage ?? 0

  ).sort(
    (a, b) =>
      b.total - a.total
  );

}

/**
 * Tỷ lệ trạng thái hóa đơn.
 *
 * Trả về dữ liệu phù hợp
 * để vẽ Pie/Doughnut Chart.
 *
 * @param {Array} invoices
 * @returns {Array}
 */
export function calculateInvoiceStatusRatio(
  invoices
) {

  const groups =
    countGroup(

      ensureArray(
        invoices
      ),

      invoice =>
        invoice.status ??
        "unknown"

    );

  const total =
    groups.reduce(

      (sum, item) =>

        sum + item.count,

      0

    );

  return groups.map(
    item => ({

      status:
        item.key,

      count:
        item.count,

      percentage:

        total === 0
          ? 0
          : Math.round(

              (
                item.count /
                total
              ) * 10000

            ) / 100

    })
  );

}

/**
 * Tổng điện của một tháng.
 *
 * @param {Array} meterReadings
 * @param {string} month
 * @returns {number}
 */
export function calculateElectricUsageOfMonth(
  meterReadings,
  month
) {

  return sumBy(

    ensureArray(
      meterReadings
    ).filter(

      reading =>

        (
          reading.month ??
          reading.period
        ) === month

    ),

    reading =>
      reading.electricUsage

  );

}

/**
 * Tổng nước của một tháng.
 *
 * @param {Array} meterReadings
 * @param {string} month
 * @returns {number}
 */
export function calculateWaterUsageOfMonth(
  meterReadings,
  month
) {

  return sumBy(

    ensureArray(
      meterReadings
    ).filter(

      reading =>

        (
          reading.month ??
          reading.period
        ) === month

    ),

    reading =>
      reading.waterUsage

  );

}

/**
 * Thống kê thanh toán theo phương thức.
 *
 * Dữ liệu trả về phù hợp để vẽ
 * Pie/Doughnut/Bar Chart.
 *
 * @param {Array} payments
 * @returns {Array}
 */
export function calculatePaymentMethodRatio(
  payments
) {

  const groups =
    groupBy(

      ensureArray(
        payments
      ),

      payment =>

        payment.method ??
        "unknown"

    );

  return [
    ...groups.entries()
  ]

    .map(

      ([method, items]) => ({

        method,

        count:
          items.length,

        amount:
          sumBy(

            items,

            payment =>
              payment.amount

          )

      })

    )

    .sort(
      (a, b) =>
        b.amount -
        a.amount
    );

}

/**
 * Lấy danh sách hợp đồng
 * sắp hết hạn.
 *
 * @param {Array} contracts
 * @param {number} days
 * @param {Date|string} currentDate
 * @returns {Array}
 */
export function calculateExpiringContracts(
  contracts,
  days = 30,
  currentDate = new Date()
) {

  const today =
    new Date(
      currentDate
    );

  today.setHours(
    0,
    0,
    0,
    0
  );

  return ensureArray(
    contracts
  )

    .filter(
      contract => {

        if (
          !contract.endDate
        ) {

          return false;

        }

        const endDate =
          new Date(
            contract.endDate
          );

        if (
          Number.isNaN(
            endDate.getTime()
          )
        ) {

          return false;

        }

        endDate.setHours(
          0,
          0,
          0,
          0
        );

        const diffDays =
          Math.ceil(

            (
              endDate -
              today
            ) /

            (
              1000 *
              60 *
              60 *
              24
            )

          );

        return (

          diffDays >= 0 &&

          diffDays <= days &&

          contract.status ===
            "active"

        );

      }

    )

    .map(
      contract => ({

        ...contract,

        remainingDays:

          Math.ceil(

            (

              new Date(
                contract.endDate
              ) -

              today

            ) /

            (

              1000 *
              60 *
              60 *
              24

            )

          )

      })

    )

    .sort(
      (a, b) =>
        a.remainingDays -
        b.remainingDays
    );

}

/**
 * Chuyển dữ liệu sang
 * format Chart.js.
 *
 * @param {Array} items
 * @param {string} labelField
 * @param {string} valueField
 * @returns {Object}
 */
export function toChartDataset(
  items,
  labelField,
  valueField
) {

  const list =
    ensureArray(
      items
    );

  return {

    labels:

      list.map(
        item =>
          item[
            labelField
          ]
      ),

    values:

      list.map(
        item =>
          toNumber(
            item[
              valueField
            ]
          )
      )

  };

}

/**
 * Chuẩn hóa dữ liệu
 * biểu đồ nhiều series.
 *
 * @param {Array} items
 * @param {string} labelField
 * @param {Array<string>} valueFields
 * @returns {Object}
 */
export function toMultiSeriesDataset(
  items,
  labelField,
  valueFields
) {

  const list =
    ensureArray(
      items
    );

  return {

    labels:

      list.map(
        item =>
          item[
            labelField
          ]
      ),

    datasets:

      valueFields.map(
        field => ({

          label:
            field,

          data:

            list.map(
              item =>

                toNumber(
                  item[
                    field
                  ]
                )

            )

        })

      )

  };

}