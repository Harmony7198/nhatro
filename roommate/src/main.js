import { createLayout } from "./components/layout.js";
import { initializeToast } from "./components/toast.js";
import { initializeConfirmDialog } from "./components/confirm-dialog.js";

import {
  registerRoute,
  initializeRouter
} from "./router.js";

// ===== Page modules =====
import { renderDashboard } from "./pages/dashboard/index.js";
import { renderRooms } from "./pages/rooms/index.js";
import { renderTenants } from "./pages/tenants/index.js";
import { renderContracts } from "./pages/contracts/index.js";
import { renderMeters } from "./pages/meters/index.js";
import { renderServices } from "./pages/services/index.js";
import { renderInvoices } from "./pages/invoices/index.js";
import { renderPayments } from "./pages/payments/index.js";
import { renderDebts } from "./pages/debts/index.js";
import { renderReports } from "./pages/reports/index.js";
import { renderSettings } from "./pages/settings/index.js";
import { renderNotFound } from "./pages/not-found/index.js";

// =========================

const app = document.querySelector("#app");

createLayout(app);

initializeToast();
initializeConfirmDialog();

// Register routes
registerRoute("/dashboard", renderDashboard);
registerRoute("/rooms", renderRooms);
registerRoute("/tenants", renderTenants);
registerRoute("/contracts", renderContracts);
registerRoute("/meters", renderMeters);
registerRoute("/services", renderServices);
registerRoute("/invoices", renderInvoices);
registerRoute("/payments", renderPayments);
registerRoute("/debts", renderDebts);
registerRoute("/reports", renderReports);
registerRoute("/settings", renderSettings);

// 404
registerRoute("/404", renderNotFound);

// Start router
initializeRouter();