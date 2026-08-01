import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

import {
    getCurrentIsoDateTime,
    formatDate,
    formatInputDate,
    compareDates,
    daysBetween,
    isValidDate
} from "../../../src/utils/date-utils.js";

describe("date-utils", () => {

    beforeEach(() => {

        vi.useFakeTimers();

        vi.setSystemTime(
            new Date("2026-07-26T12:30:45.123Z")
        );

    });

    afterEach(() => {

        vi.useRealTimers();

    });

    describe("getCurrentIsoDateTime()", () => {

        it("should return current ISO datetime", () => {

            expect(
                getCurrentIsoDateTime()
            ).toBe(
                "2026-07-26T12:30:45.123Z"
            );

        });

    });

    describe("formatDate()", () => {

        it("should format Date object", () => {

            expect(

                formatDate(
                    new Date("2026-07-26")
                )

            ).toBe(
                "26/07/2026"
            );

        });

        it("should format ISO string", () => {

            expect(

                formatDate(
                    "2026-07-26"
                )

            ).toBe(
                "26/07/2026"
            );

        });

        it("should throw for empty string", () => {

            expect(() => {

                formatDate("");

            }).toThrow();

        });

        it("should throw for blank string", () => {

            expect(() => {

                formatDate("   ");

            }).toThrow();

        });

        it("should throw for invalid date", () => {

            expect(() => {

                formatDate("abc");

            }).toThrow();

        });

        it("should throw for null", () => {

            expect(() => {

                formatDate(null);

            }).toThrow();

        });

        it("should throw for undefined", () => {

            expect(() => {

                formatDate(undefined);

            }).toThrow();

        });

    });

    describe("formatInputDate()", () => {

        it("should convert yyyy-mm-dd", () => {

            expect(

                formatInputDate(
                    "2026-07-26"
                )

            ).toBe(
                "26/07/2026"
            );

        });

        it("should trim spaces", () => {

            expect(

                formatInputDate(
                    " 2026-07-26 "
                )

            ).toBe(
                "26/07/2026"
            );

        });

        it("should throw for wrong format", () => {

            expect(() => {

                formatInputDate(
                    "26/07/2026"
                );

            }).toThrow();

        });

        it("should throw for empty string", () => {

            expect(() => {

                formatInputDate("");

            }).toThrow();

        });

        it("should throw for null", () => {

            expect(() => {

                formatInputDate(null);

            }).toThrow();

        });

    });

    describe("compareDates()", () => {

        it("should return -1", () => {

            expect(

                compareDates(
                    "2026-01-01",
                    "2026-01-02"
                )

            ).toBe(-1);

        });

        it("should return 1", () => {

            expect(

                compareDates(
                    "2026-01-03",
                    "2026-01-02"
                )

            ).toBe(1);

        });

        it("should return 0", () => {

            expect(

                compareDates(
                    "2026-01-02",
                    "2026-01-02"
                )

            ).toBe(0);

        });

        it("should throw for invalid date", () => {

            expect(() => {

                compareDates(
                    "abc",
                    "2026-01-01"
                );

            }).toThrow();

        });

    });

    describe("daysBetween()", () => {

        it("should calculate difference", () => {

            expect(

                daysBetween(
                    "2026-01-01",
                    "2026-01-11"
                )

            ).toBe(10);

        });

        it("should ignore order", () => {

            expect(

                daysBetween(
                    "2026-01-11",
                    "2026-01-01"
                )

            ).toBe(10);

        });

        it("should return zero for same day", () => {

            expect(

                daysBetween(
                    "2026-01-01",
                    "2026-01-01"
                )

            ).toBe(0);

        });

        it("should throw for invalid input", () => {

            expect(() => {

                daysBetween(
                    "",
                    "2026-01-01"
                );

            }).toThrow();

        });

    });

    describe("isValidDate()", () => {

        it("should return true for ISO string", () => {

            expect(

                isValidDate(
                    "2026-07-26"
                )

            ).toBe(true);

        });

        it("should return true for Date object", () => {

            expect(

                isValidDate(
                    new Date()
                )

            ).toBe(true);

        });

        it("should return false for invalid string", () => {

            expect(

                isValidDate(
                    "abc"
                )

            ).toBe(false);

        });

        it("should return false for empty string", () => {

            expect(

                isValidDate("")
            ).toBe(false);

        });

        it("should return false for null", () => {

            expect(

                isValidDate(null)

            ).toBe(false);

        });

        it("should return false for undefined", () => {

            expect(

                isValidDate(undefined)

            ).toBe(false);

        });

    });

});