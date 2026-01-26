import { UsageLog } from "../../types/schema";
import { computeExpiredStats } from "../analytics";

describe("computeExpiredStats", () => {
  const mockLogs = [
    {
      item_name: "Spinach",
      quantity: 1,
      action: "expired",
      logged_at: "2025-01-01T10:00:00Z",
    },
    {
      item_name: "Spinach",
      quantity: 1,
      action: "expired",
      logged_at: "2025-01-05T10:00:00Z",
    },
    {
      item_name: "Milk",
      quantity: 1, // Only 1 expired
      action: "expired",
      logged_at: "2025-01-02T10:00:00Z",
    },
    {
      item_name: "Milk",
      quantity: 1,
      action: "consumed", // This should be ignored
      logged_at: "2025-01-03T10:00:00Z",
    },
  ] as UsageLog[];

  it("aggregates counts and quantity correctly", () => {
    const stats = computeExpiredStats(mockLogs);

    // Spinach: 2 expired
    // Milk: 1 expired (consumed ignored)

    expect(stats).toHaveLength(2);

    const spinach = stats.find((s) => s.name === "Spinach");
    expect(spinach).toBeDefined();
    expect(spinach?.count).toBe(2);
    expect(spinach?.totalQuantity).toBe(2);
    expect(spinach?.lastExpired).toBe("2025-01-05T10:00:00Z");

    const milk = stats.find((s) => s.name === "Milk");
    expect(milk).toBeDefined();
    expect(milk?.count).toBe(1);
  });

  it("handles case insensitivity", () => {
    const logs = [
      { item_name: "apple", action: "expired", logged_at: "2025-01-01" },
      { item_name: "Apple", action: "expired", logged_at: "2025-01-01" },
    ] as UsageLog[];

    const stats = computeExpiredStats(logs);
    expect(stats).toHaveLength(1);
    expect(stats[0].name).toBe("Apple"); // Should capitalize
    expect(stats[0].count).toBe(2);
  });

  it("returns empty array for empty logs", () => {
    expect(computeExpiredStats([])).toEqual([]);
  });

  it("limits to top 10 items", () => {
    // Create 11 different items
    const logs = Array.from({ length: 11 }, (_, i) => ({
      item_name: `Item${i}`,
      quantity: 1,
      action: "expired",
      logged_at: "2025-01-01",
    })) as UsageLog[];

    const stats = computeExpiredStats(logs);
    expect(stats).toHaveLength(10);
  });
});
