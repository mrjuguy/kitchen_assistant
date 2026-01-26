import { getItemHealth } from "./itemHealth";
import { PantryItem } from "../types/schema";

export const groupItemsByLocation = (items: PantryItem[]) => {
  const grouped = {
    Fridge: [] as PantryItem[],
    Freezer: [] as PantryItem[],
    Pantry: [] as PantryItem[],
  };

  items.forEach((item) => {
    const loc = item.storage_location || "pantry"; // Default to pantry
    if (loc === "fridge") grouped.Fridge.push(item);
    else if (loc === "freezer") grouped.Freezer.push(item);
    else grouped.Pantry.push(item);
  });

  return [
    { title: "Fridge", data: grouped.Fridge },
    { title: "Freezer", data: grouped.Freezer },
    { title: "Pantry", data: grouped.Pantry },
  ];
};

export const groupItemsByExpiry = (items: PantryItem[]) => {
  const sections: Record<string, PantryItem[]> = {
    Expired: [],
    Critical: [],
    Warning: [],
    Good: [],
    "No Date": [],
  };

  items.forEach((item) => {
    if (!item.expiry_date) {
      sections["No Date"].push(item);
      return;
    }
    const health = getItemHealth(item.expiry_date);
    if (health.status === "expired") sections["Expired"].push(item);
    else if (health.status === "critical") sections["Critical"].push(item);
    else if (health.status === "warning") sections["Warning"].push(item);
    else sections["Good"].push(item);
  });

  return [
    { title: "Expired", data: sections["Expired"] },
    { title: "Critical", data: sections["Critical"] },
    { title: "Warning", data: sections["Warning"] },
    { title: "Good", data: sections["Good"] },
    { title: "No Date", data: sections["No Date"] },
  ];
};
