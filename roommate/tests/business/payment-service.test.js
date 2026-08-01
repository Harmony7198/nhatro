/**
 * @file payment-service.test.js
 * @description Business test cho nghiệp vụ thanh toán hóa đơn.
 */

import {
  describe,
  it,
  expect,
  beforeEach
} from "vitest";

import * as InvoiceService from "../../src/services/invoice-service.js";
import * as PaymentService from "../../src/services/payment-service.js";

describe("Payment Business", () => {

  let invoice;

  beforeEach(() => {

    localStorage.clear();

    invoice =
      InvoiceService.createInvoice({

        roomId: "room-01",

        monthKey: "2026-07",

        rentAmount: 2_000_000,

        electricAmount: 0,

        waterAmount: 0,

        serviceAmount: 0,

        discount: 0,

        dueDate: "2026-07-10"

      });

  });

  it("Thanh toán nhiều lần phải cập nhật công nợ và trạng thái", () => {

    PaymentService.createPayment({

      invoiceId: invoice.id,

      amount: 1_200_000,

      paymentDate: "2026-07-05",

      method: "cash"

    });

    let updated =
      InvoiceService.getInvoiceById(
        invoice.id
      );

    expect(
      updated.totalAmount
    ).toBe(2_000_000);

    expect(
      updated.paidAmount
    ).toBe(1_200_000);

    expect(
      updated.remainingAmount
    ).toBe(800_000);

    expect(
      updated.status
    ).toBe("PARTIALLY_PAID");

    PaymentService.createPayment({

      invoiceId: invoice.id,

      amount: 800_000,

      paymentDate: "2026-07-06",

      method: "cash"

    });

    updated =
      InvoiceService.getInvoiceById(
        invoice.id
      );

    expect(
      updated.paidAmount
    ).toBe(2_000_000);

    expect(
      updated.remainingAmount
    ).toBe(0);

    expect(
      updated.status
    ).toBe("PAID");

  });

  it("Không cho thanh toán vượt công nợ", () => {

    expect(() => {

      PaymentService.createPayment({

        invoiceId: invoice.id,

        amount: 2_500_000,

        paymentDate: "2026-07-05",

        method: "cash"

      });

    }).toThrow();

  });

  it("Xóa giao dịch phải cập nhật lại hóa đơn", () => {

    const payment =
      PaymentService.createPayment({

        invoiceId: invoice.id,

        amount: 1_000_000,

        paymentDate: "2026-07-05",

        method: "cash"

      });

    let updated =
      InvoiceService.getInvoiceById(
        invoice.id
      );

    expect(
      updated.remainingAmount
    ).toBe(1_000_000);

    expect(
      updated.status
    ).toBe("PARTIALLY_PAID");

    PaymentService.deletePayment(
      payment.id
    );

    updated =
      InvoiceService.getInvoiceById(
        invoice.id
      );

    expect(
      updated.paidAmount
    ).toBe(0);

    expect(
      updated.remainingAmount
    ).toBe(2_000_000);

    expect(
      updated.status
    ).toBe("UNPAID");

  });

  it("Không cho thanh toán hóa đơn đã hủy", () => {

    InvoiceService.cancelInvoice(
      invoice.id
    );

    expect(() => {

      PaymentService.createPayment({

        invoiceId: invoice.id,

        amount: 500_000,

        paymentDate: "2026-07-05",

        method: "cash"

      });

    }).toThrow();

  });

});