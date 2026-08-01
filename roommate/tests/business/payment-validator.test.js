import { describe, it, expect } from "vitest";

import {
    validatePayment
} from "../../src/business/payment-validator.js";

describe("PaymentValidator", () => {

    const invoice = {

        total: 500000,
        paidAmount: 100000,
        cancelled: false

    };

    const payment = {

        amount: 200000,
        method: "cash",
        paymentDate: "2026-07-20"

    };

    it("should accept valid payment", () => {

        const result =
            validatePayment(
                payment,
                invoice
            );

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);

    });

    it("should reject zero payment", () => {

        const result =
            validatePayment(
                {
                    ...payment,
                    amount: 0
                },
                invoice
            );

        expect(result.valid).toBe(false);
        expect(result.errors)
            .toContain(
                "Số tiền thanh toán phải lớn hơn 0."
            );

    });

    it("should reject negative payment", () => {

        const result =
            validatePayment(
                {
                    ...payment,
                    amount: -1
                },
                invoice
            );

        expect(result.valid).toBe(false);

    });

    it("should reject payment larger than remaining debt", () => {

        const result =
            validatePayment(
                {
                    ...payment,
                    amount: 500000
                },
                invoice
            );

        expect(result.valid).toBe(false);

        expect(result.errors)
            .toContain(
                "Số tiền thanh toán vượt quá công nợ còn lại."
            );

    });

    it("should reject cancelled invoice", () => {

        const result =
            validatePayment(
                payment,
                {
                    ...invoice,
                    cancelled: true
                }
            );

        expect(result.valid).toBe(false);

    });

    it("should reject fully paid invoice", () => {

        const result =
            validatePayment(
                payment,
                {
                    ...invoice,
                    paidAmount: 500000
                }
            );

        expect(result.valid).toBe(false);

        expect(result.errors)
            .toContain(
                "Hóa đơn đã được thanh toán đầy đủ."
            );

    });

    it("should reject NaN", () => {

        const result =
            validatePayment(
                {
                    ...payment,
                    amount: NaN
                },
                invoice
            );

        expect(result.valid).toBe(false);

    });

    it("should require payment method", () => {

        const result =
            validatePayment(
                {
                    ...payment,
                    method: ""
                },
                invoice
            );

        expect(result.valid).toBe(false);

    });

    it("should require payment date", () => {

        const result =
            validatePayment(
                {
                    ...payment,
                    paymentDate: ""
                },
                invoice
            );

        expect(result.valid).toBe(false);

    });

    it("should reject missing payment", () => {

        const result =
            validatePayment(
                null,
                invoice
            );

        expect(result.valid).toBe(false);

    });

    it("should reject missing invoice", () => {

        const result =
            validatePayment(
                payment,
                null
            );

        expect(result.valid).toBe(false);

    });

});