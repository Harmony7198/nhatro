import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

import {
    generateId,
    isValidGeneratedId
} from "../../../src/utils/id-utils.js";

describe("id-utils", () => {

    beforeEach(() => {

        vi.useFakeTimers();

        vi.setSystemTime(
            new Date("2026-07-26T12:30:45.123Z")
        );

    });

    afterEach(() => {

        vi.useRealTimers();

        vi.restoreAllMocks();

    });

    describe("generateId()", () => {

        it("should generate ID with default prefix", () => {

            const id =
                generateId();

            expect(id)
                .toMatch(
                    /^ID-\d{17}-[A-Z0-9]{8}$/
                );

        });

        it("should generate ID with custom prefix", () => {

            const id =
                generateId("ROOM");

            expect(id.startsWith("ROOM-"))
                .toBe(true);

        });

        it("should automatically uppercase prefix", () => {

            const id =
                generateId("invoice");

            expect(id.startsWith("INVOICE-"))
                .toBe(true);

        });

        it("should trim prefix", () => {

            const id =
                generateId("  tenant  ");

            expect(id.startsWith("TENANT-"))
                .toBe(true);

        });

        it("should generate different IDs", () => {

            vi.useRealTimers();

            const id1 =
                generateId("ROOM");

            const id2 =
                generateId("ROOM");

            expect(id1)
                .not
                .toBe(id2);

        });

        it("should throw when prefix is empty", () => {

            expect(() => {

                generateId("");

            }).toThrow();

        });

        it("should throw when prefix only contains spaces", () => {

            expect(() => {

                generateId("     ");

            }).toThrow();

        });

        it("should throw when prefix is null", () => {

            expect(() => {

                generateId(null);

            }).toThrow();

        });

        it("should throw when prefix is undefined object type", () => {

            expect(() => {

                generateId({});

            }).toThrow();

        });

        it("should throw when prefix is number", () => {

            expect(() => {

                generateId(123);

            }).toThrow();

        });

        it("should throw when prefix is array", () => {

            expect(() => {

                generateId([]);

            }).toThrow();

        });

    });

    describe("isValidGeneratedId()", () => {

        it("should return true for generated ID", () => {

            const id =
                generateId("ROOM");

            expect(
                isValidGeneratedId(id)
            ).toBe(true);

        });

        it("should return false for invalid prefix", () => {

            expect(

                isValidGeneratedId(
                    "room-20260726123045123-ABCDEFGH"
                )

            ).toBe(false);

        });

        it("should return false for invalid timestamp", () => {

            expect(

                isValidGeneratedId(
                    "ROOM-123-ABCDEFGH"
                )

            ).toBe(false);

        });

        it("should return false for invalid random part", () => {

            expect(

                isValidGeneratedId(
                    "ROOM-20260726123045123-ABC"
                )

            ).toBe(false);

        });

        it("should return false for empty string", () => {

            expect(

                isValidGeneratedId("")

            ).toBe(false);

        });

        it("should return false for null", () => {

            expect(

                isValidGeneratedId(null)

            ).toBe(false);

        });

        it("should return false for undefined", () => {

            expect(

                isValidGeneratedId(undefined)

            ).toBe(false);

        });

        it("should return false for object", () => {

            expect(

                isValidGeneratedId({})

            ).toBe(false);

        });

        it("should return false for array", () => {

            expect(

                isValidGeneratedId([])

            ).toBe(false);

        });

        it("should return false for number", () => {

            expect(

                isValidGeneratedId(123)

            ).toBe(false);

        });

    });

});