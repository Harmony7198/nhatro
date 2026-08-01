// tests/business/contract-flow.test.js

import {
    describe,
    it,
    expect,
    beforeEach
} from "vitest";

import {
    createRoom,
    getRoomById
} from "../../src/services/room-service.js";

import {
    createTenant,
    getTenantById
} from "../../src/services/tenant-service.js";

import {
    createContract,
    activateContract,
    getContractById,
    getContracts
} from "../../src/services/contract-service.js";

import {
    clearAll
} from "../../src/services/storage-service.js";

import {
    ROOM_STATUS,
    CONTRACT_STATUS
} from "../../src/constants/statuses.js";

describe("Business - Contract Flow", () => {

    beforeEach(() => {

        clearAll();

    });

    it("should create room -> tenant -> contract -> activate successfully", () => {

        const room = createRoom({

            id: "room-1",

            code: "A101",

            name: "Phòng A101",

            floor: 1,

            maxOccupants: 4,

            rentPrice: 3000000,

            status: ROOM_STATUS.AVAILABLE

        });

        const tenant = createTenant({

            id: "tenant-1",

            fullName: "Nguyen Van A",

            phoneNumber: "0901234567",

            identityNumber: "012345678901"

        });

        const contract = createContract({

            id: "contract-1",

            contractNumber: "HD001",

            roomId: room.id,

            tenantId: tenant.id,

            roomCode: room.code,

            roomName: room.name,

            tenantName: tenant.fullName,

            startDate: "2026-08-01",

            endDate: "2027-07-31",

            deposit: 3000000

        });

        expect(getContracts()).toHaveLength(1);

        const stored = getContractById(contract.id);

        expect(stored.roomId).toBe(room.id);

        expect(stored.tenantId).toBe(tenant.id);

        activateContract(contract.id);

        const activeContract =
            getContractById(contract.id);

        expect(activeContract.status)
            .toBe(CONTRACT_STATUS.ACTIVE);

        const updatedRoom =
            getRoomById(room.id);

        expect(updatedRoom.status)
            .toBe(ROOM_STATUS.OCCUPIED);

        expect(
            getTenantById(tenant.id).id
        ).toBe(tenant.id);

    });

    it("should reject overlapping contract", () => {

        const room = createRoom({

            id: "room-2",

            code: "A102",

            name: "Phòng A102",

            floor: 1,

            maxOccupants: 4,

            rentPrice: 3500000,

            status: ROOM_STATUS.AVAILABLE

        });

        const tenant1 = createTenant({

            id: "tenant-2",

            fullName: "Tenant One",

            phoneNumber: "0901111111",

            identityNumber: "111111111111"

        });

        const tenant2 = createTenant({

            id: "tenant-3",

            fullName: "Tenant Two",

            phoneNumber: "0902222222",

            identityNumber: "222222222222"

        });

        createContract({

            id: "contract-2",

            contractNumber: "HD002",

            roomId: room.id,

            tenantId: tenant1.id,

            roomCode: room.code,

            roomName: room.name,

            tenantName: tenant1.fullName,

            startDate: "2026-08-01",

            endDate: "2027-07-31",

            deposit: 3000000

        });

        expect(() =>

            createContract({

                id: "contract-3",

                contractNumber: "HD003",

                roomId: room.id,

                tenantId: tenant2.id,

                roomCode: room.code,

                roomName: room.name,

                tenantName: tenant2.fullName,

                startDate: "2026-10-01",

                endDate: "2027-05-31",

                deposit: 3000000

            })

        ).toThrow();

    });

});