const currency = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  minimumFractionDigits: 2,
});

export const formatRM = (value: number) => currency.format(value);

export const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short" });

/** Value for <input type="datetime-local"> in the user's local time. */
export const toLocalInputValue = (date = new Date()) => {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

/** Parses a money string, returning NaN if it isn't a valid amount with max 2 decimals. */
export const parseAmount = (raw: string) => {
  const trimmed = raw.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return NaN;
  return Number(trimmed);
};

/** crypto.randomUUID only exists on HTTPS, so fall back for plain-HTTP hosts. */
export const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
