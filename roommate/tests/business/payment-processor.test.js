import { describe, it, expect } from "vitest";

import {
    calculateTotalPaid,
    calculateRemainingAmount,
    determinePaymentStatus,
    canDeletePayment,
    groupPaymentsByMethod
} from "../../src/business/payment-processor.js";

describe("PaymentProcessor", () => {

    describe("calculateTotalPaid()", () => {

        it("should calculate total correctly", () => {

            expect(
                calculateTotalPaid([
                    { amount: 100000 },
                    { amount: 200000 },
                    { amount: 50000 }
                ])
            ).toBe(350000);

        });

        it("should return zero for empty array", () => {

            expect(
                calculateTotalPaid([])
            ).toBe(0);

        });

        it("should reject negative amount", () => {

            expect(() =>
                calculateTotalPaid([
                    { amount: -1 }
                ])
            ).toThrow();

        });

        it("should reject NaN", () => {

            expect(() =>
                calculateTotalPaid([
                    { amount: NaN }
                ])
            ).toThrow();

        });

    });

    describe("calculateRemainingAmount()", () => {

        it("should calculate remaining debt", () => {

            expect(
                calculateRemainingAmount(
                    500000,
                    [
                        { amount: 100000 },
                        { amount: 50000 }
                    ]
                )
            ).toBe(350000);

        });

        it("should never return negative debt", () => {

            expect(
                calculateRemainingAmount(
                    500000,
                    [
                        { amount: 600000 }
                    ]
                )
            ).toBe(0);

        });

    });

    describe("determinePaymentStatus()", () => {

        it("should return unpaid", () => {

            expect(
                determinePaymentStatus(
                    500000,
                    [],
                    "2099-01-01",
                    "2026-01-01"
                )
            ).toBe("unpaid");

        });

        it("should return partial", () => {

            expect(
                determinePaymentStatus(
                    500000,
                    [{ amount: 100000 }],
                    "2099-01-01",
                    "2026-01-01"
                )
            ).toBe("partial");

        });

        it("should return paid", () => {

            expect(
                determinePaymentStatus(
                    500000,
                    [{ amount: 500000 }],
                    "2099-01-01",
                    "2026-01-01"
                )
            ).toBe("paid");

        });

        it("should return overdue", () => {

            expect(
                determinePaymentStatus(
                    500000,
                    [],
                    "2025-01-01",
                    "2025-02-01"
                )
            ).toBe("overdue");

        });

    });

    describe("canDeletePayment()", () => {

        it("should allow deleting valid payment", () => {

            expect(
                canDeletePayment(
                    { id: 1 },
                    { cancelled: false }
                )
            ).toBe(true);

        });

        it("should reject cancelled invoice", () => {

            expect(
                canDeletePayment(
                    { id: 1 },
                    { cancelled: true }
                )
            ).toBe(false);

        });

        it("should reject null payment", () => {

            expect(
                canDeletePayment(
                    null,
                    {}
                )
            ).toBe(false);

        });

    });

    describe("groupPaymentsByMethod()", () => {

        it("should group correctly", () => {

            const result =
                groupPaymentsByMethod([
                    {
                        amount: 100000,
                        method: "cash"
                    },
                    {
                        amount: 200000,
                        method: "cash"
                    },
                    {
                        amount: 50000,
                        method: "bank"
                    }
                ]);

            expect(
                result.cash.count
            ).toBe(2);

            expect(
                result.cash.totalAmount
            ).toBe(300000);

            expect(
                result.bank.count
            ).toBe(1);

            expect(
                result.bank.totalAmount
            ).toBe(50000);

        });

    });

});