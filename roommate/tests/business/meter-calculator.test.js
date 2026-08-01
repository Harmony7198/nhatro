import {
    describe,
    it,
    expect
} from "vitest";

import {
    calculateUsage,
    calculateElectricUsage,
    calculateWaterUsage,
    detectAbnormalUsage,
    getPreviousMonthKey
} from "../../../src/business/meter-calculator.js";

describe("MeterCalculator", () => {

    describe("calculateUsage()", () => {

        it("120 -> 165 should return 45", () => {

            expect(
                calculateUsage(120, 165)
            ).toBe(45);

        });

        it("same index should return 0", () => {

            expect(
                calculateUsage(120, 120)
            ).toBe(0);

        });

        it("new index smaller should throw", () => {

            expect(() =>
                calculateUsage(165, 120)
            ).toThrow();

        });

        it("negative index should throw", () => {

            expect(() =>
                calculateUsage(-1, 10)
            ).toThrow();

        });

        it("NaN should throw", () => {

            expect(() =>
                calculateUsage(NaN, 10)
            ).toThrow();

        });

        it("numeric string should throw", () => {

            expect(() =>
                calculateUsage("120", "165")
            ).toThrow();

        });

    });

    describe("calculateElectricUsage()", () => {

        it("should calculate correctly", () => {

            expect(
                calculateElectricUsage(120, 165)
            ).toBe(45);

        });

    });

    describe("calculateWaterUsage()", () => {

        it("should calculate correctly", () => {

            expect(
                calculateWaterUsage(50, 70)
            ).toBe(20);

        });

    });

    describe("detectAbnormalUsage()", () => {

        it("should detect abnormal increase", () => {

            expect(
                detectAbnormalUsage(
                    150,
                    50
                )
            ).toBe(true);

        });

        it("should not detect normal increase", () => {

            expect(
                detectAbnormalUsage(
                    70,
                    50
                )
            ).toBe(false);

        });

        it("should return true when previous usage is zero", () => {

            expect(
                detectAbnormalUsage(
                    10,
                    0
                )
            ).toBe(true);

        });

        it("should return false when both usages are zero", () => {

            expect(
                detectAbnormalUsage(
                    0,
                    0
                )
            ).toBe(false);

        });

        it("negative threshold should throw", () => {

            expect(() =>
                detectAbnormalUsage(
                    100,
                    50,
                    -1
                )
            ).toThrow();

        });

    });

    describe("getPreviousMonthKey()", () => {

        it("should return previous month", () => {

            expect(
                getPreviousMonthKey(
                    "2026-07"
                )
            ).toBe("2026-06");

        });

        it("should handle year boundary", () => {

            expect(
                getPreviousMonthKey(
                    "2026-01"
                )
            ).toBe("2025-12");

        });

        it("invalid format should throw", () => {

            expect(() =>
                getPreviousMonthKey(
                    "07/2026"
                )
            ).toThrow();

        });

    });

});