/**
 * @file invoice-flow.business.test.js
 * @description Business test:
 * Phòng đang thuê
 * -> Hợp đồng hiệu lực
 * -> Ghi chỉ số
 * -> Có cấu hình dịch vụ
 * -> Tạo hóa đơn
 */

import {
  describe,
  beforeEach,
  it,
  expect
} from "vitest";

import * as StorageService from "../../src/services/storage-service.js";

import * as RoomService from "../../src/services/room-service.js";
import * as TenantService from "../../src/services/tenant-service.js";
import * as ContractService from "../../src/services/contract-service.js";
import * as MeterReadingService from "../../src/services/meter-reading-service.js";
import * as ServiceConfigService from "../../src/services/service-config-service.js";
import * as InvoiceService from "../../src/services/invoice-service.js";

describe(
  "Invoice Business Flow",
  () => {

    let room;
    let tenant;
    let contract;

    beforeEach(() => {

      localStorage.clear();

      room =
        RoomService.createRoom({

          code: "P101",

          name: "Phòng 101",

          floor: 1,

          area: 25,

          rentPrice: 3000000,

          status: "available"

        });

      tenant =
        TenantService.createTenant({

          fullName: "Nguyễn Văn A",

          phoneNumber: "0901234567",

          identityNumber: "079123456789"

        });

      contract =
        ContractService.createContract({

          contractNumber: "HD001",

          roomId: room.id,

          roomCode: room.code,

          tenantId: tenant.id,

          tenantName: tenant.fullName,

          tenantIds: [tenant.id],

          rentPrice: 3000000,

          deposit: 3000000,

          startDate: "2026-01-01",

          endDate: "2026-12-31",

          status: "active"

        });

      ContractService.activateContract(
        contract.id
      );

      MeterReadingService.createReading({

        roomId: room.id,

        monthKey: "2026-07",

        electricOldIndex: 100,

        electricNewIndex: 150,

        waterOldIndex: 20,

        waterNewIndex: 30

      });

      ServiceConfigService.createService({

        code: "ELECTRIC",

        name: "Điện",

        calculationType: "usage",

        unitPrice: 3500,

        active: true

      });

      ServiceConfigService.createService({

        code: "WATER",

        name: "Nước",

        calculationType: "usage",

        unitPrice: 12000,

        active: true

      });

      ServiceConfigService.createService({

        code: "WIFI",

        name: "Wifi",

        calculationType: "fixed",

        unitPrice: 100000,

        active: true

      });

    });

    it(
      "Tạo hóa đơn đúng",
      () => {

        const invoice =
          InvoiceService.createInvoice({

            roomId: room.id,

            monthKey: "2026-07",

            dueDate: "2026-07-10"

          });

        const rent =
          invoice.items.find(
            item =>
              item.code === "RENT"
          );

        const electric =
          invoice.items.find(
            item =>
              item.code === "ELECTRIC"
          );

        const water =
          invoice.items.find(
            item =>
              item.code === "WATER"
          );

        const wifi =
          invoice.items.find(
            item =>
              item.code === "WIFI"
          );

        expect(
          electric.quantity
        ).toBe(50);

        expect(
          water.quantity
        ).toBe(10);

        expect(
          electric.amount
        ).toBe(
          50 * 3500
        );

        expect(
          water.amount
        ).toBe(
          10 * 12000
        );

        expect(
          rent.amount
        ).toBe(
          contract.rentPrice
        );

        expect(
          wifi.amount
        ).toBe(
          100000
        );

        const expectedTotal =
          invoice.items.reduce(
            (sum, item) =>
              sum + item.amount,
            0
          );

        expect(
          invoice.total
        ).toBe(
          expectedTotal
        );

        expect(
          invoice.finalized
        ).toBe(false);

      }
    );

    it(
      "Không tạo hóa đơn trùng phòng và tháng",
      () => {

        InvoiceService.createInvoice({

          roomId: room.id,

          monthKey: "2026-07",

          dueDate: "2026-07-10"

        });

        expect(() =>

          InvoiceService.createInvoice({

            roomId: room.id,

            monthKey: "2026-07",

            dueDate: "2026-07-10"

          })

        ).toThrow();

      }
    );

    it(
      "Không tạo hóa đơn nếu chưa có chỉ số",
      () => {

        const room2 =
          RoomService.createRoom({

            code: "P102",

            name: "Phòng 102",

            floor: 1,

            area: 20,

            rentPrice: 2500000,

            status: "available"

          });

        const tenant2 =
          TenantService.createTenant({

            fullName: "Trần Văn B",

            phoneNumber: "0912345678",

            identityNumber: "079999999999"

          });

        const contract2 =
          ContractService.createContract({

            contractNumber: "HD002",

            roomId: room2.id,

            roomCode: room2.code,

            tenantId: tenant2.id,

            tenantName: tenant2.fullName,

            tenantIds: [tenant2.id],

            rentPrice: 2500000,

            deposit: 2500000,

            startDate: "2026-01-01",

            endDate: "2026-12-31",

            status: "active"

          });

        ContractService.activateContract(
          contract2.id
        );

        expect(() =>

          InvoiceService.createInvoice({

            roomId: room2.id,

            monthKey: "2026-07",

            dueDate: "2026-07-10"

          })

        ).toThrow(
          "Chưa có chỉ số điện nước."
        );

      }
    );

  }
);