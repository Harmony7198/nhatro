import {
    describe,
    it,
    expect
} from "vitest";

import {
    formatCurrency,
    formatNumber,
    parseCurrency,
    roundCurrency
} from "../../../src/utils/currency-utils.js";

describe("currency-utils", () => {

    describe("formatCurrency()", () => {

        it("should format VND currency", () => {

            const result =
                formatCurrency(1500000);

            expect(result)
                .toContain("1.500.000");

            expect(result)
                .toContain("₫");

        });

        it("should format zero", () => {

            expect(
                formatCurrency(0)
            ).toContain("0");

        });

        it("should format negative value", () => {

            expect(
                formatCurrency(-500000)
            ).toContain("500.000");

        });

        it("should throw for NaN", () => {

            expect(() => {

                formatCurrency(NaN);

            }).toThrow();

        });

        it("should throw for string", () => {

            expect(() => {

                formatCurrency("1000");

            }).toThrow();

        });

        it("should throw for null", () => {

            expect(() => {

                formatCurrency(null);

            }).toThrow();

        });

        it("should throw for undefined", () => {

            expect(() => {

                formatCurrency(undefined);

            }).toThrow();

        });

    });

    describe("formatNumber()", () => {

        it("should format integer", () => {

            expect(
                formatNumber(1234567)
            ).toBe("1.234.567");

        });

        it("should round decimal", () => {

            expect(
                formatNumber(1234.8)
            ).toBe("1.235");

        });

        it("should format zero", () => {

            expect(
                formatNumber(0)
            ).toBe("0");

        });

        it("should throw for NaN", () => {

            expect(() => {

                formatNumber(NaN);

            }).toThrow();

        });

        it("should throw for string", () => {

            expect(() => {

                formatNumber("100");

            }).toThrow();

        });

    });

    describe("parseCurrency()", () => {

        it("should parse dot separator", () => {

            expect(

                parseCurrency(
                    "1.500.000"
                )

            ).toBe(1500000);

        });

        it("should parse comma separator", () => {

            expect(

                parseCurrency(
                    "1,500,000"
                )

            ).toBe(1500000);

        });

        it("should parse spaces", () => {

            expect(

                parseCurrency(
                    "1 500 000"
                )

            ).toBe(1500000);

        });

        it("should parse currency symbol", () => {

            expect(

                parseCurrency(
                    "1.500.000đ"
                )

            ).toBe(1500000);

        });

        it("should return number unchanged", () => {

            expect(

                parseCurrency(
                    2000000
                )

            ).toBe(2000000);

        });

        it("should throw for empty string", () => {

            expect(() => {

                parseCurrency("");

            }).toThrow();

        });

        it("should throw for blank string", () => {

            expect(() => {

                parseCurrency("    ");

            }).toThrow();

        });

        it("should throw for invalid text", () => {

            expect(() => {

                parseCurrency("abc");

            }).toThrow();

        });

        it("should throw for null", () => {

            expect(() => {

                parseCurrency(null);

            }).toThrow();

        });

        it("should throw for undefined", () => {

            expect(() => {

                parseCurrency(undefined);

            }).toThrow();

        });

        it("should throw for NaN number", () => {

            expect(() => {

                parseCurrency(NaN);

            }).toThrow();

        });

    });

    describe("roundCurrency()", () => {

        it("should round down", () => {

            expect(
                roundCurrency(100.4)
            ).toBe(100);

        });

        it("should round up", () => {

            expect(
                roundCurrency(100.5)
            ).toBe(101);

        });

        it("should round integer", () => {

            expect(
                roundCurrency(500)
            ).toBe(500);

        });

        it("should round negative number", () => {

            expect(
                roundCurrency(-100.6)
            ).toBe(-101);

        });

        it("should throw for NaN", () => {

            expect(() => {

                roundCurrency(NaN);

            }).toThrow();

        });

        it("should throw for string", () => {

            expect(() => {

                roundCurrency("100");

            }).toThrow();

        });

        it("should throw for null", () => {

            expect(() => {

                roundCurrency(null);

            }).toThrow();

        });

    });

});