import {
    describe,
    it,
    expect
} from "vitest";

import {
    isNumber,
    toNumber,
    clamp,
    sum,
    average
} from "../../../src/utils/number-utils.js";

describe("number-utils", () => {

    describe("isNumber()", () => {

        it("should return true for integer", () => {

            expect(
                isNumber(100)
            ).toBe(true);

        });

        it("should return true for decimal", () => {

            expect(
                isNumber(10.5)
            ).toBe(true);

        });

        it("should return true for zero", () => {

            expect(
                isNumber(0)
            ).toBe(true);

        });

        it("should return false for NaN", () => {

            expect(
                isNumber(NaN)
            ).toBe(false);

        });

        it("should return false for string", () => {

            expect(
                isNumber("100")
            ).toBe(false);

        });

        it("should return false for null", () => {

            expect(
                isNumber(null)
            ).toBe(false);

        });

        it("should return false for undefined", () => {

            expect(
                isNumber(undefined)
            ).toBe(false);

        });

    });

    describe("toNumber()", () => {

        it("should convert integer string", () => {

            expect(
                toNumber("123")
            ).toBe(123);

        });

        it("should convert decimal string", () => {

            expect(
                toNumber("123.5")
            ).toBe(123.5);

        });

        it("should trim spaces", () => {

            expect(
                toNumber("  500 ")
            ).toBe(500);

        });

        it("should return number unchanged", () => {

            expect(
                toNumber(100)
            ).toBe(100);

        });

        it("should throw for invalid text", () => {

            expect(() => {

                toNumber("abc");

            }).toThrow();

        });

        it("should throw for empty string", () => {

            expect(() => {

                toNumber("");

            }).toThrow();

        });

        it("should throw for null", () => {

            expect(() => {

                toNumber(null);

            }).toThrow();

        });

        it("should throw for undefined", () => {

            expect(() => {

                toNumber(undefined);

            }).toThrow();

        });

    });

    describe("clamp()", () => {

        it("should return value inside range", () => {

            expect(
                clamp(5, 1, 10)
            ).toBe(5);

        });

        it("should clamp to minimum", () => {

            expect(
                clamp(-5, 1, 10)
            ).toBe(1);

        });

        it("should clamp to maximum", () => {

            expect(
                clamp(20, 1, 10)
            ).toBe(10);

        });

        it("should return minimum boundary", () => {

            expect(
                clamp(1, 1, 10)
            ).toBe(1);

        });

        it("should return maximum boundary", () => {

            expect(
                clamp(10, 1, 10)
            ).toBe(10);

        });

        it("should throw for invalid arguments", () => {

            expect(() => {

                clamp("10", 1, 20);

            }).toThrow();

        });

    });

    describe("sum()", () => {

        it("should calculate total", () => {

            expect(

                sum([1, 2, 3, 4])

            ).toBe(10);

        });

        it("should return zero for empty array", () => {

            expect(

                sum([])

            ).toBe(0);

        });

        it("should work with one value", () => {

            expect(

                sum([8])

            ).toBe(8);

        });

        it("should throw for invalid array", () => {

            expect(() => {

                sum(null);

            }).toThrow();

        });

        it("should throw for non-number element", () => {

            expect(() => {

                sum([1, "2"]);

            }).toThrow();

        });

    });

    describe("average()", () => {

        it("should calculate average", () => {

            expect(

                average([2, 4, 6])

            ).toBe(4);

        });

        it("should return zero for empty array", () => {

            expect(

                average([])

            ).toBe(0);

        });

        it("should return same value for one element", () => {

            expect(

                average([9])

            ).toBe(9);

        });

        it("should throw for invalid input", () => {

            expect(() => {

                average(null);

            }).toThrow();

        });

        it("should throw for invalid member", () => {

            expect(() => {

                average([1, "3"]);

            }).toThrow();

        });

    });

});