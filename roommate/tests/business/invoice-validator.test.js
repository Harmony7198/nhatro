import {
    describe,
    it,
    expect
} from "vitest";

import {
    validateInvoice
} from "../../src/business/invoice-validator.js";

describe("InvoiceValidator", () => {

    const validInvoice = {

        items: [
            { amount: 100000 },
            { amount: 200000 }
        ],

        discount: 10000,

        paidAmount: 50000,

        dueDate: "2099-01-01"

    };

    it("should accept valid invoice", () => {

        expect(() =>
            validateInvoice(validInvoice)
        ).not.toThrow();

    });

    it("should reject discount larger than subtotal", () => {

        expect(() =>
            validateInvoice({
                ...validInvoice,
                discount: 500000
            })
        ).toThrow();

    });

    it("should accept zero discount", () => {

        expect(() =>
            validateInvoice({
                ...validInvoice,
                discount: 0
            })
        ).not.toThrow();

    });

    it("should reject negative total item", () => {

        expect(() =>
            validateInvoice({
                ...validInvoice,
                items: [
                    { amount: -1 }
                ]
            })
        ).toThrow();

    });

    it("should reject NaN", () => {

        expect(() =>
            validateInvoice({
                ...validInvoice,
                paidAmount: NaN
            })
        ).toThrow();

    });

    it("should reject invalid due date", () => {

        expect(() =>
            validateInvoice({
                ...validInvoice,
                dueDate: "abc"
            })
        ).toThrow();

    });

});