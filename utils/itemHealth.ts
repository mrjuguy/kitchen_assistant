import { differenceInDays, parseISO, startOfToday } from "date-fns";

export type HealthStatus = "good" | "warning" | "critical" | "expired";

export interface HealthInfo {
  status: HealthStatus;
  label: string;
  color: string;
  daysRemaining?: number;
}

/**
 * Calculates the health status of a pantry item based on its expiry date.
 *
 * - Expired: date < today
 * - Critical: 0 <= days <= 2
 * - Warning: 3 <= days <= 7
 * - Good: days > 7 or no expiry date
 */
export const getItemHealth = (expiryDate?: string | null): HealthInfo => {
  if (!expiryDate) {
    return {
      status: "good",
      label: "Fresh",
      color: "#10b981", // emerald-500
    };
  }

  const today = startOfToday();
  const expiry = parseISO(expiryDate);
  const daysRemaining = differenceInDays(expiry, today);

  if (daysRemaining < 0) {
    return {
      status: "expired",
      label: "Expired",
      color: "#ef4444", // red-500
      daysRemaining,
    };
  }

  if (daysRemaining <= 2) {
    return {
      status: "critical",
      label:
        daysRemaining === 0 ? "Expires today" : `Expires in ${daysRemaining}d`,
      color: "#f97316", // orange-500
      daysRemaining,
    };
  }

  if (daysRemaining <= 7) {
    return {
      status: "warning",
      label: `Expires in ${daysRemaining}d`,
      color: "#eab308", // yellow-500
      daysRemaining,
    };
  }

  return {
    status: "good",
    label: `Expires in ${daysRemaining}d`,
    color: "#10b981", // emerald-500
    daysRemaining,
  };
};
