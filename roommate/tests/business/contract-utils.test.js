import { describe, it, expect } from "vitest";

import {
    isDateRangeOverlap,
    hasOverlappingContract,
    determineContractStatus,
    isContractActive,
    isContractExpiringSoon
} from "../../src/business/contract-utils.js";

import {
    CONTRACT_STATUS
} from "../../src/constants/statuses.js";

describe("ContractUtils", () => {

    describe("isDateRangeOverlap()", () => {

        it("should return false when ranges do not overlap", () => {

            expect(
                isDateRangeOverlap(
                    "2026-01-01",
                    "2026-01-31",
                    "2026-02-01",
                    "2026-02-28"
                )
            ).toBe(false);

        });

        it("should detect partial overlap", () => {

            expect(
                isDateRangeOverlap(
                    "2026-01-01",
                    "2026-01-31",
                    "2026-01-20",
                    "2026-02-10"
                )
            ).toBe(true);

        });

        it("should detect complete overlap", () => {

            expect(
                isDateRangeOverlap(
                    "2026-01-01",
                    "2026-03-31",
                    "2026-01-15",
                    "2026-02-01"
                )
            ).toBe(true);

        });

        it("should treat same boundary day as overlap", () => {

            expect(
                isDateRangeOverlap(
                    "2026-01-01",
                    "2026-01-31",
                    "2026-01-31",
                    "2026-02-28"
                )
            ).toBe(true);

        });

    });

    describe("hasOverlappingContract()", () => {

        const existing = [
            {
                id: "C1",
                roomId: "R1",
                startDate: "2026-01-01",
                endDate: "2026-03-31",
                status: CONTRACT_STATUS.ACTIVE
            }
        ];

        it("should detect overlapping contract", () => {

            expect(
                hasOverlappingContract(
                    {
                        id: "C2",
                        roomId: "R1",
                        startDate: "2026-03-01",
                        endDate: "2026-04-30"
                    },
                    existing
                )
            ).toBe(true);

        });

        it("should ignore different room", () => {

            expect(
                hasOverlappingContract(
                    {
                        id: "C2",
                        roomId: "R2",
                        startDate: "2026-03-01",
                        endDate: "2026-04-30"
                    },
                    existing
                )
            ).toBe(false);

        });

        it("should ignore cancelled contract", () => {

            expect(
                hasOverlappingContract(
                    {
                        roomId: "R1",
                        startDate: "2026-03-01",
                        endDate: "2026-04-30"
                    },
                    [
                        {
                            ...existing[0],
                            status: CONTRACT_STATUS.TERMINATED
                        }
                    ]
                )
            ).toBe(false);

        });

    });

    describe("determineContractStatus()", () => {

        const contract = {
            startDate: "2026-01-01",
            endDate: "2026-12-31",
            status: CONTRACT_STATUS.ACTIVE
        };

        it("should return ACTIVE", () => {

            expect(
                determineContractStatus(
                    contract,
                    "2026-06-01"
                )
            ).toBe(CONTRACT_STATUS.ACTIVE);

        });

        it("should return EXPIRED", () => {

            expect(
                determineContractStatus(
                    contract,
                    "2027-01-01"
                )
            ).toBe(CONTRACT_STATUS.EXPIRED);

        });

    });

    describe("isContractActive()", () => {

        it("should return true", () => {

            expect(
                isContractActive(
                    {
                        startDate: "2026-01-01",
                        endDate: "2026-12-31",
                        status: CONTRACT_STATUS.ACTIVE
                    },
                    "2026-06-01"
                )
            ).toBe(true);

        });

    });

    describe("isContractExpiringSoon()", () => {

        it("should return true", () => {

            expect(
                isContractExpiringSoon(
                    {
                        startDate: "2026-01-01",
                        endDate: "2026-07-20",
                        status: CONTRACT_STATUS.ACTIVE
                    },
                    "2026-07-01"
                )
            ).toBe(true);

        });

        it("should return false", () => {

            expect(
                isContractExpiringSoon(
                    {
                        startDate: "2026-01-01",
                        endDate: "2026-12-31",
                        status: CONTRACT_STATUS.ACTIVE
                    },
                    "2026-07-01"
                )
            ).toBe(false);

        });

        it("should throw for negative warningDays", () => {

            expect(() =>
                isContractExpiringSoon(
                    {
                        startDate: "2026-01-01",
                        endDate: "2026-07-20",
                        status: CONTRACT_STATUS.ACTIVE
                    },
                    "2026-07-01",
                    -1
                )
            ).toThrow();

        });

    });

});