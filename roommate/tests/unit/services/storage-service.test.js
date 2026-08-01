import {
    describe,
    it,
    expect,
    beforeEach
} from "vitest";

import {
    getAll,
    getById,
    create,
    update,
    remove,
    replaceAll,
    safeParse,
    exportAll,
    importAll,
    clearKey,
    clearAll
} from "../../../src/services/storage-service.js";

import {
    STORAGE_KEYS
} from "../../../src/constants/storage-keys.js";

describe("StorageService", () => {

    const KEY = STORAGE_KEYS.ROOMS;

    beforeEach(() => {

        localStorage.clear();

    });

    describe("getAll()", () => {

        it("should return empty array when storage is empty", () => {

            expect(
                getAll(KEY)
            ).toEqual([]);

        });

    });

    describe("create()", () => {

        it("should create successfully", () => {

            const created = create(KEY, {
                id: "R1",
                name: "Room 1"
            });

            expect(created.id).toBe("R1");

            expect(
                getAll(KEY)
            ).toHaveLength(1);

        });

        it("should reject duplicate id", () => {

            create(KEY, {
                id: "R1",
                name: "Room"
            });

            expect(() =>
                create(KEY, {
                    id: "R1",
                    name: "Duplicate"
                })
            ).toThrow();

        });

    });

    describe("getById()", () => {

        it("should find existing item", () => {

            create(KEY, {
                id: "R1",
                name: "Room"
            });

            expect(
                getById(KEY, "R1").name
            ).toBe("Room");

        });

        it("should return null if not found", () => {

            expect(
                getById(KEY, "UNKNOWN")
            ).toBeNull();

        });

    });

    describe("update()", () => {

        it("should update successfully", () => {

            create(KEY, {
                id: "R1",
                name: "Old"
            });

            const updated = update(
                KEY,
                "R1",
                {
                    name: "New"
                }
            );

            expect(
                updated.name
            ).toBe("New");

        });

        it("should reject unknown id", () => {

            expect(() =>
                update(
                    KEY,
                    "UNKNOWN",
                    {
                        name: "ABC"
                    }
                )
            ).toThrow();

        });

    });

    describe("remove()", () => {

        it("should remove successfully", () => {

            create(KEY, {
                id: "R1"
            });

            expect(
                remove(KEY, "R1")
            ).toBe(true);

            expect(
                getAll(KEY)
            ).toHaveLength(0);

        });

    });

    describe("replaceAll()", () => {

        it("should replace collection", () => {

            const items = [

                {
                    id: "A"
                },

                {
                    id: "B"
                }

            ];

            const result =
                replaceAll(
                    KEY,
                    items
                );

            expect(result)
                .toHaveLength(2);

            expect(
                getAll(KEY)
            ).toHaveLength(2);

        });

    });

    describe("safeParse()", () => {

        it("should parse valid json", () => {

            expect(
                safeParse(
                    '{"a":1}',
                    {}
                )
            ).toEqual({
                a: 1
            });

        });

        it("should return fallback for invalid json", () => {

            expect(
                safeParse(
                    "{abc}",
                    []
                )
            ).toEqual([]);

        });

    });

    describe("exportAll()", () => {

        it("should export all collections", () => {

            create(KEY, {
                id: "R1"
            });

            const exported =
                exportAll();

            expect(
                exported
            ).toHaveProperty(KEY);

            expect(
                exported[KEY]
            ).toHaveLength(1);

        });

    });

    describe("importAll()", () => {

        it("should import valid data", () => {

            importAll({

                [KEY]: [

                    {
                        id: "R1"
                    }

                ]

            });

            expect(
                getAll(KEY)
            ).toHaveLength(1);

        });

        it("should reject invalid collection", () => {

            expect(() =>
                importAll({

                    [KEY]: {}

                })
            ).toThrow();

        });

    });

    describe("clearKey()", () => {

        it("should remove one storage key", () => {

            create(KEY, {
                id: "R1"
            });

            clearKey(KEY);

            expect(
                getAll(KEY)
            ).toEqual([]);

        });

    });

    describe("clearAll()", () => {

        it("should clear localStorage", () => {

            create(KEY, {
                id: "R1"
            });

            clearAll();

            expect(
                getAll(KEY)
            ).toEqual([]);

        });

    });

});