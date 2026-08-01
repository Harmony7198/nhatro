import {
    describe,
    it,
    expect
} from "vitest";

import {
    isEmpty,
    isNotEmpty,
    hasMinLength,
    hasMaxLength,
    hasLengthBetween,
    isVietnamesePhoneNumber,
    isEmail,
    isNonNegative,
    isPositive,
    isValidDate,
    isInEnum,
    isRequired
} from "../../../src/utils/validation-utils.js";

describe("validation-utils", () => {

    describe("isEmpty()", () => {

        it("should return true for empty string", () => {
            expect(isEmpty("")).toBe(true);
        });

        it("should return true for blank string", () => {
            expect(isEmpty("   ")).toBe(true);
        });

        it("should return false for normal string", () => {
            expect(isEmpty("Room")).toBe(false);
        });

        it("should return true for null", () => {
            expect(isEmpty(null)).toBe(true);
        });

        it("should return true for undefined", () => {
            expect(isEmpty(undefined)).toBe(true);
        });

    });

    describe("isNotEmpty()", () => {

        it("should return true for normal string", () => {
            expect(isNotEmpty("ABC")).toBe(true);
        });

        it("should return false for empty string", () => {
            expect(isNotEmpty("")).toBe(false);
        });

    });

    describe("hasMinLength()", () => {

        it("should return true when length is enough", () => {
            expect(hasMinLength("Room", 4)).toBe(true);
        });

        it("should return true at boundary", () => {
            expect(hasMinLength("1234", 4)).toBe(true);
        });

        it("should return false when too short", () => {
            expect(hasMinLength("abc", 4)).toBe(false);
        });

        it("should return false for null", () => {
            expect(hasMinLength(null, 1)).toBe(false);
        });

        it("should throw for invalid minLength", () => {
            expect(() => hasMinLength("abc", -1)).toThrow();
        });

    });

    describe("hasMaxLength()", () => {

        it("should return true", () => {
            expect(hasMaxLength("abc", 5)).toBe(true);
        });

        it("should return true at boundary", () => {
            expect(hasMaxLength("abc", 3)).toBe(true);
        });

        it("should return false", () => {
            expect(hasMaxLength("abcdef", 3)).toBe(false);
        });

        it("should return false for undefined", () => {
            expect(hasMaxLength(undefined, 5)).toBe(false);
        });

        it("should throw for invalid maxLength", () => {
            expect(() => hasMaxLength("abc", -2)).toThrow();
        });

    });

    describe("hasLengthBetween()", () => {

        it("should return true", () => {
            expect(hasLengthBetween("Room", 2, 5)).toBe(true);
        });

        it("should return false when below minimum", () => {
            expect(hasLengthBetween("A", 2, 5)).toBe(false);
        });

        it("should return false when above maximum", () => {
            expect(hasLengthBetween("ABCDEFG", 2, 5)).toBe(false);
        });

        it("should throw when min > max", () => {
            expect(() =>
                hasLengthBetween("abc", 5, 2)
            ).toThrow();
        });

    });

    describe("isVietnamesePhoneNumber()", () => {

        it("should accept mobile number", () => {
            expect(
                isVietnamesePhoneNumber("0912345678")
            ).toBe(true);
        });

        it("should accept +84", () => {
            expect(
                isVietnamesePhoneNumber("+84912345678")
            ).toBe(true);
        });

        it("should accept spaces", () => {
            expect(
                isVietnamesePhoneNumber("0912 345 678")
            ).toBe(true);
        });

        it("should accept dashes", () => {
            expect(
                isVietnamesePhoneNumber("0912-345-678")
            ).toBe(true);
        });

        it("should reject invalid number", () => {
            expect(
                isVietnamesePhoneNumber("123456")
            ).toBe(false);
        });

        it("should reject null", () => {
            expect(
                isVietnamesePhoneNumber(null)
            ).toBe(false);
        });

    });

    describe("isEmail()", () => {

        it("should accept valid email", () => {
            expect(
                isEmail("roommate@test.com")
            ).toBe(true);
        });

        it("should trim spaces", () => {
            expect(
                isEmail(" test@test.com ")
            ).toBe(true);
        });

        it("should reject invalid email", () => {
            expect(
                isEmail("abc")
            ).toBe(false);
        });

        it("should reject empty string", () => {
            expect(
                isEmail("")
            ).toBe(false);
        });

        it("should reject null", () => {
            expect(
                isEmail(null)
            ).toBe(false);
        });

    });

    describe("isNonNegative()", () => {

        it("should accept zero", () => {
            expect(isNonNegative(0)).toBe(true);
        });

        it("should accept positive number", () => {
            expect(isNonNegative(10)).toBe(true);
        });

        it("should reject negative number", () => {
            expect(isNonNegative(-1)).toBe(false);
        });

        it("should reject NaN", () => {
            expect(isNonNegative(NaN)).toBe(false);
        });

    });

    describe("isPositive()", () => {

        it("should accept positive number", () => {
            expect(isPositive(5)).toBe(true);
        });

        it("should reject zero", () => {
            expect(isPositive(0)).toBe(false);
        });

        it("should reject negative number", () => {
            expect(isPositive(-5)).toBe(false);
        });

    });

    describe("isValidDate()", () => {

        it("should accept Date object", () => {
            expect(
                isValidDate(new Date())
            ).toBe(true);
        });

        it("should accept ISO string", () => {
            expect(
                isValidDate("2026-07-26")
            ).toBe(true);
        });

        it("should reject invalid string", () => {
            expect(
                isValidDate("abc")
            ).toBe(false);
        });

        it("should reject empty string", () => {
            expect(
                isValidDate("")
            ).toBe(false);
        });

        it("should reject null", () => {
            expect(
                isValidDate(null)
            ).toBe(false);
        });

    });

    describe("isInEnum()", () => {

        it("should return true", () => {
            expect(
                isInEnum(
                    "PAID",
                    ["PAID", "UNPAID"]
                )
            ).toBe(true);
        });

        it("should return false", () => {
            expect(
                isInEnum(
                    "CANCELLED",
                    ["PAID", "UNPAID"]
                )
            ).toBe(false);
        });

        it("should throw for invalid enum", () => {
            expect(() =>
                isInEnum("A", null)
            ).toThrow();
        });

    });

    describe("isRequired()", () => {

        it("should accept string", () => {
            expect(isRequired("Room")).toBe(true);
        });

        it("should accept zero", () => {
            expect(isRequired(0)).toBe(true);
        });

        it("should accept false", () => {
            expect(isRequired(false)).toBe(true);
        });

        it("should reject null", () => {
            expect(isRequired(null)).toBe(false);
        });

        it("should reject undefined", () => {
            expect(isRequired(undefined)).toBe(false);
        });

    });

});