import {
    describe,
    it,
    expect
} from "vitest";

import {
    validateMeterReading,
    validatePreviousIndex
} from "../../src/business/meter-validator.js";

const validReading = {

    roomId: "ROOM001",

    monthKey: "2026-07",

    electricOldIndex: 120,

    electricNewIndex: 165,

    waterOldIndex: 20,

    waterNewIndex: 35

};

describe("MeterValidator", () => {

    describe("validateMeterReading()", () => {

        it("should accept valid reading", () => {

            expect(
                validateMeterReading(
                    validReading
                )
            ).toEqual(validReading);

        });

        it("same index should be valid", () => {

            const reading = {

                ...validReading,

                electricNewIndex: 120,

                waterNewIndex: 20

            };

            expect(
                validateMeterReading(reading)
            ).toEqual(reading);

        });

        it("new electric index smaller should throw", () => {

            expect(() =>

                validateMeterReading({

                    ...validReading,

                    electricNewIndex: 100

                })

            ).toThrow();

        });

        it("negative index should throw", () => {

            expect(() =>

                validateMeterReading({

                    ...validReading,

                    waterOldIndex: -1

                })

            ).toThrow();

        });

        it("NaN should throw", () => {

            expect(() =>

                validateMeterReading({

                    ...validReading,

                    electricOldIndex: NaN

                })

            ).toThrow();

        });

        it("numeric string should throw", () => {

            expect(() =>

                validateMeterReading({

                    ...validReading,

                    electricOldIndex: "120"

                })

            ).toThrow();

        });

    });

    describe("validatePreviousIndex()", () => {

        it("should accept matching previous reading", () => {

            const previous = {

                ...validReading,

                electricOldIndex: 100,

                electricNewIndex: 120,

                waterOldIndex: 10,

                waterNewIndex: 20

            };

            expect(

                validatePreviousIndex(
                    validReading,
                    previous
                )

            ).toBe(true);

        });

        it("should allow null previous reading", () => {

            expect(

                validatePreviousIndex(
                    validReading,
                    null
                )

            ).toBe(true);

        });

        it("should detect wrong previous electric index", () => {

            const previous = {

                ...validReading,

                electricNewIndex: 119

            };

            expect(() =>

                validatePreviousIndex(
                    validReading,
                    previous
                )

            ).toThrow();

        });

        it("should detect wrong previous water index", () => {

            const previous = {

                ...validReading,

                waterNewIndex: 19

            };

            expect(() =>

                validatePreviousIndex(
                    validReading,
                    previous
                )

            ).toThrow();

        });

    });

});