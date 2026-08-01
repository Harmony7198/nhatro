import {
  describe,
  it,
  expect,
  beforeEach
} from "vitest";

import * as StorageService from "../../src/services/storage-service.js";
import * as InvoiceService from "../../src/services/invoice-service.js";
import * as PaymentService from "../../src/services/payment-service.js";

import { STORAGE_KEYS } from "../../src/constants/storage-keys.js";

describe(
  "Business - Payment Flow",
  () => {

    let invoice;

    beforeEach(() => {

      for (const key of Object.values(STORAGE_KEYS)) {
        localStorage.removeItem(key);
      }

      invoice = {
        id: "invoice-1",
        roomId: "room-1",
        contractId: "contract-1",
        monthKey: "2026-07",
        issueDate: "2026-07-01",
        dueDate: "2026-07-10",
        subtotal: 2000000,
        total: 2000000,
        discount: 0,
        paidAmount: 0,
        remainingDebt: 2000000,
        status: "unpaid",
        finalized: false,
        cancelled: false,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      StorageService.create(
        STORAGE_KEYS.INVOICES,
        invoice
      );

    });

    it(
      "Thanh toán 1.200.000 rồi thanh toán tiếp đủ công nợ",
      () => {

        PaymentService.createPayment({
          invoiceId: invoice.id,
          amount: 1200000,
          method: "cash"
        });

        let updated =
          InvoiceService.getInvoiceById(
            invoice.id
          );

        expect(
          updated.paidAmount
        ).toBe(1200000);

        expect(
          updated.remainingDebt
        ).toBe(800000);

        expect(
          updated.status
        ).toBe(
          "partial"
        );

        PaymentService.createPayment({
          invoiceId: invoice.id,
          amount: 800000,
          method: "cash"
        });

        updated =
          InvoiceService.getInvoiceById(
            invoice.id
          );

        expect(
          updated.paidAmount
        ).toBe(2000000);

        expect(
          updated.remainingDebt
        ).toBe(0);

        expect(
          updated.status
        ).toBe(
          "paid"
        );

      }
    );

    it(
      "Không cho thanh toán vượt công nợ",
      () => {

        expect(() => {

          PaymentService.createPayment({
            invoiceId: invoice.id,
            amount: 2500000,
            method: "cash"
          });

        }).toThrow();

      }
    );

    it(
      "Xóa giao dịch phải cập nhật lại hóa đơn",
      () => {

        const payment =
          PaymentService.createPayment({

            invoiceId: invoice.id,

            amount: 1200000,

            method: "cash"

          });

        let updated =
          InvoiceService.getInvoiceById(
            invoice.id
          );

        expect(
          updated.remainingDebt
        ).toBe(800000);

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
          updated.remainingDebt
        ).toBe(2000000);

        expect(
          updated.status
        ).toBe(
          "unpaid"
        );

      }
    );

    it(
      "Không cho thanh toán hóa đơn đã hủy",
      () => {

        StorageService.update(
          STORAGE_KEYS.INVOICES,
          invoice.id,
          {
            cancelled: true,
            status: "cancelled"
          }
        );

        expect(() => {

          PaymentService.createPayment({

            invoiceId: invoice.id,

            amount: 100000,

            method: "cash"

          });

        }).toThrow();

      }
    );

  }
);