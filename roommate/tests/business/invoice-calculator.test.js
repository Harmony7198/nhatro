import {
    describe,
    it,
    expect
} from "vitest";

import {
    calculateElectricAmount,
    calculateWaterAmount,
    calculateFixedServiceAmount,
    calculatePerPersonAmount,
    calculateSubtotal,
    calculateDiscount,
    calculateInvoiceTotal,
    calculateRemainingDebt,
    determineInvoiceStatus
} from "../../src/business/invoice-calculator.js";

describe("InvoiceCalculator", () => {

    it("should calculate electric amount", () => {

        expect(
            calculateElectricAmount(45, 3500)
        ).toBe(157500);

    });

    it("should calculate water amount", () => {

        expect(
            calculateWaterAmount(12, 18000)
        ).toBe(216000);

    });

    it("should calculate fixed service", () => {

        expect(
            calculateFixedServiceAmount(150000)
        ).toBe(150000);

    });

    it("should calculate per-person service", () => {

        expect(
            calculatePerPersonAmount(3, 100000)
        ).toBe(300000);

    });

    it("should calculate subtotal", () => {

        expect(
            calculateSubtotal([
                { amount: 100000 },
                { amount: 200000 },
                { amount: 50000 }
            ])
        ).toBe(350000);

    });

    it("should apply discount", () => {

        expect(
            calculateDiscount(
                500000,
                50000
            )
        ).toBe(50000);

    });

    it("should accept zero discount", () => {

        expect(
            calculateDiscount(
                500000,
                0
            )
        ).toBe(0);

    });

    it("should throw when discount exceeds subtotal", () => {

        expect(() =>
            calculateDiscount(
                100000,
                150000
            )
        ).toThrow();

    });

    it("should calculate remaining debt", () => {

        expect(
            calculateRemainingDebt(
                500000,
                200000
            )
        ).toBe(300000);

    });

    it("should return unpaid", () => {

        expect(
            determineInvoiceStatus(
                500000,
                0,
                "2099-01-01"
            )
        ).toBe("unpaid");

    });

    it("should return partial", () => {

        expect(
            determineInvoiceStatus(
                500000,
                100000,
                "2099-01-01"
            )
        ).toBe("partial");

    });

    it("should return paid", () => {

        expect(
            determineInvoiceStatus(
                500000,
                500000,
                "2099-01-01"
            )
        ).toBe("paid");

    });

    it("should return overdue", () => {

        expect(
            determineInvoiceStatus(
                500000,
                0,
                "2025-01-01",
                "2025-02-01"
            )
        ).toBe("overdue");

    });

    it("should never return negative remaining debt", () => {

        expect(
            calculateRemainingDebt(
                500000,
                700000
            )
        ).toBe(0);

    });

    it("should reject NaN", () => {

        expect(() =>
            calculateElectricAmount(
                NaN,
                3500
            )
        ).toThrow();

    });

});