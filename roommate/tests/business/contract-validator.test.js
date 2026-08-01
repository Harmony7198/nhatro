import { describe, it, expect } from "vitest";

import {
    validateContract,
    validateOccupancyLimit,
    validateRoomAvailable,
    validateContractDateRange,
    isValidContractStatus
} from "../../src/business/contract-validator.js";

import {
    ROOM_STATUS,
    CONTRACT_STATUS
} from "../../src/constants/statuses.js";

describe("ContractValidator", () => {

    const validContract = {

        roomId: "R1",
        tenantId: "T1",

        startDate: "2026-01-01",
        endDate: "2026-12-31",

        rentPrice: 3000000,
        deposit: 3000000

    };

    it("should accept valid contract", () => {

        expect(() =>
            validateContract(validContract)
        ).not.toThrow();

    });

    it("should reject end date before start date", () => {

        expect(() =>
            validateContract({
                ...validContract,
                startDate: "2026-05-01",
                endDate: "2026-04-01"
            })
        ).toThrow();

    });

    it("should reject repair room", () => {

        expect(() =>
            validateContract(
                validContract,
                {
                    room: {
                        status: ROOM_STATUS.REPAIR
                    }
                }
            )
        ).toThrow();

    });

    it("should reject inactive room", () => {

        expect(() =>
            validateContract(
                validContract,
                {
                    room: {
                        status: ROOM_STATUS.INACTIVE
                    }
                }
            )
        ).toThrow();

    });

    it("should reject overlapping contract", () => {

        expect(() =>
            validateContract(
                validContract,
                {
                    existingContracts: [
                        {
                            roomId: "R1",
                            startDate: "2026-06-01",
                            endDate: "2026-09-01",
                            status: CONTRACT_STATUS.ACTIVE
                        }
                    ]
                }
            )
        ).toThrow();

    });

    it("should validate occupancy", () => {

        expect(() =>
            validateOccupancyLimit(
                {
                    maxOccupancy: 3
                },
                ["A", "B", "C"]
            )
        ).not.toThrow();

    });

    it("should reject occupancy overflow", () => {

        expect(() =>
            validateOccupancyLimit(
                {
                    maxOccupancy: 2
                },
                ["A", "B", "C"]
            )
        ).toThrow();

    });

    it("should validate room available", () => {

        expect(() =>
            validateRoomAvailable({
                status: ROOM_STATUS.AVAILABLE
            })
        ).not.toThrow();

    });

    it("should reject repair room", () => {

        expect(() =>
            validateRoomAvailable({
                status: ROOM_STATUS.REPAIR
            })
        ).toThrow();

    });

    it("should validate contract date range", () => {

        expect(
            validateContractDateRange(
                "2026-01-01",
                "2026-12-31"
            )
        ).toBe(true);

    });

    it("should reject invalid date range", () => {

        expect(
            validateContractDateRange(
                "2026-05-01",
                "2026-04-01"
            )
        ).toBe(false);

    });

    it("should validate contract status", () => {

        expect(
            isValidContractStatus(
                CONTRACT_STATUS.ACTIVE
            )
        ).toBe(true);

    });

    it("should reject invalid status", () => {

        expect(
            isValidContractStatus("UNKNOWN")
        ).toBe(false);

    });

});