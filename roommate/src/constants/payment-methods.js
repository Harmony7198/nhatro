export const PAYMENT_METHOD = Object.freeze({
  CASH: "cash",
  BANK_TRANSFER: "bankTransfer",
  E_WALLET: "eWallet",
  OTHER: "other"
});

export const PAYMENT_METHOD_LABEL = Object.freeze({
  [PAYMENT_METHOD.CASH]: "Tiền mặt",
  [PAYMENT_METHOD.BANK_TRANSFER]: "Chuyển khoản",
  [PAYMENT_METHOD.E_WALLET]: "Ví điện tử",
  [PAYMENT_METHOD.OTHER]: "Khác"
});