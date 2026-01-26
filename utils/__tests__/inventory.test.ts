import { addDays, startOfToday, subDays } from "date-fns";

import { PantryItem } from "../../types/schema";
import { groupItemsByExpiry, groupItemsByLocation } from "../inventory";

describe("groupItemsByLocation", () => {
  const mockItems: PantryItem[] = [
    {
      id: "1",
      name: "Milk",
      storage_location: "fridge",
      category: "Dairy",
    } as PantryItem,
    {
      id: "2",
      name: "Ice Cream",
      storage_location: "freezer",
      category: "Frozen",
    } as PantryItem,
    {
      id: "3",
      name: "Flour",
      storage_location: "pantry",
      category: "Pantry",
    } as PantryItem,
    { id: "4", name: "Apples", category: "Produce" } as PantryItem, // No location, should default to Pantry
  ];

  it("should split items into Fridge, Freezer, and Pantry sections", () => {
    const result = groupItemsByLocation(mockItems);

    expect(result).toHaveLength(3);
    const fridge = result.find((s) => s.title === "Fridge");
    const freezer = result.find((s) => s.title === "Freezer");
    const pantry = result.find((s) => s.title === "Pantry");

    expect(fridge?.data).toHaveLength(1);
    expect(fridge?.data[0].name).toBe("Milk");

    expect(freezer?.data).toHaveLength(1);
    expect(freezer?.data[0].name).toBe("Ice Cream");

    expect(pantry?.data).toHaveLength(2); // Flour + Apples (default)
    const names = pantry?.data.map((i) => i.name).sort();
    expect(names).toEqual(["Apples", "Flour"]);
  });

  it("should handle empty input", () => {
    const result = groupItemsByLocation([]);
    expect(result).toHaveLength(3);
    expect(result[0].data).toHaveLength(0);
    expect(result[1].data).toHaveLength(0);
    expect(result[2].data).toHaveLength(0);
  });
});

describe("groupItemsByExpiry", () => {
  const today = startOfToday();
  const mockItems: PantryItem[] = [
    {
      id: "1",
      name: "Old Meat",
      expiry_date: subDays(today, 2).toISOString(),
    } as any as PantryItem,
    {
      id: "2",
      name: "Milk Today",
      expiry_date: today.toISOString(),
    } as any as PantryItem,
    {
      id: "3",
      name: "Cheese Soon",
      expiry_date: addDays(today, 4).toISOString(),
    } as any as PantryItem,
    {
      id: "4",
      name: "Safe Rice",
      expiry_date: addDays(today, 10).toISOString(),
    } as any as PantryItem,
    { id: "5", name: "Salt", expiry_date: null } as any as PantryItem,
  ];

  it("should group items into status-based sections", () => {
    const result = groupItemsByExpiry(mockItems);

    expect(result).toHaveLength(5);

    const expired = result.find((s) => s.title === "Expired");
    const critical = result.find((s) => s.title === "Critical");
    const warning = result.find((s) => s.title === "Warning");
    const good = result.find((s) => s.title === "Good");
    const noDate = result.find((s) => s.title === "No Date");

    expect(expired?.data).toHaveLength(1);
    expect(expired?.data[0].name).toBe("Old Meat");

    expect(critical?.data).toHaveLength(1);
    expect(critical?.data[0].name).toBe("Milk Today");

    expect(warning?.data).toHaveLength(1);
    expect(warning?.data[0].name).toBe("Cheese Soon");

    expect(good?.data).toHaveLength(1);
    expect(good?.data[0].name).toBe("Safe Rice");

    expect(noDate?.data).toHaveLength(1);
    expect(noDate?.data[0].name).toBe("Salt");
  });
});
