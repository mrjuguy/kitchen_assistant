import { UsageLog } from "../types/schema";

export interface ExpiredStat {
  name: string;
  count: number;
  totalQuantity: number;
  lastExpired: string;
}

export function computeExpiredStats(
  logs: Pick<UsageLog, "item_name" | "quantity" | "logged_at" | "action">[],
): ExpiredStat[] {
  const stats: Record<
    string,
    { count: number; totalQuantity: number; lastExpired: string }
  > = {};

  logs.forEach((log) => {
    if (log.action !== "expired") return;

    // Normalize name: lowercase and trim
    const name = log.item_name.toLowerCase().trim();
    if (!stats[name]) {
      stats[name] = { count: 0, totalQuantity: 0, lastExpired: log.logged_at };
    }
    stats[name].count += 1;
    stats[name].totalQuantity += log.quantity || 0;

    // Keep most recent date
    if (new Date(log.logged_at) > new Date(stats[name].lastExpired)) {
      stats[name].lastExpired = log.logged_at;
    }
  });

  // Convert to array and sort by count (desc)
  return Object.entries(stats)
    .map(([name, stat]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize for display
      count: stat.count,
      totalQuantity: stat.totalQuantity,
      lastExpired: stat.lastExpired,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10
}
