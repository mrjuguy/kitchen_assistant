export type UnitCategory = "volume" | "weight" | "count";

export interface UnitDefinition {
  label: string;
  category: UnitCategory;
  factor: number; // Conversion factor to base unit (fl_oz for volume, oz for weight, 1 for count)
}

export const UNITS_DB: Record<string, UnitDefinition> = {
  // Volume (Base: fl_oz)
  gal: { label: "Gallon", category: "volume", factor: 128 },
  qt: { label: "Quart", category: "volume", factor: 32 },
  pt: { label: "Pint", category: "volume", factor: 16 },
  cup: { label: "Cup", category: "volume", factor: 8 },
  fl_oz: { label: "Fluid Ounce", category: "volume", factor: 1 },
  tbsp: { label: "Tablespoon", category: "volume", factor: 0.5 },
  tsp: { label: "Teaspoon", category: "volume", factor: 0.166667 },
  l: { label: "Liter", category: "volume", factor: 33.814 },
  ml: { label: "Milliliter", category: "volume", factor: 0.033814 },

  // Weight (Base: oz)
  lb: { label: "Pound", category: "weight", factor: 16 },
  oz: { label: "Ounce", category: "weight", factor: 1 },
  kg: { label: "Kilogram", category: "weight", factor: 35.274 },
  g: { label: "Gram", category: "weight", factor: 0.035274 },

  // Count
  unit: { label: "Item", category: "count", factor: 1 },
  pc: { label: "Piece", category: "count", factor: 1 },
  pkg: { label: "Package", category: "count", factor: 1 },
};

export type UnitKey = keyof typeof UNITS_DB;

export function convertUnit(
  value: number,
  fromUnit: UnitKey,
  toUnit: UnitKey,
): number {
  const fromDef = UNITS_DB[fromUnit];
  const toDef = UNITS_DB[toUnit];

  if (!fromDef || !toDef) {
    console.warn(`Invalid units: ${fromUnit} -> ${toUnit}`);
    return value;
  }

  if (fromDef.category !== toDef.category) {
    console.warn(
      `Cannot convert between categories: ${fromDef.category} -> ${toDef.category}`,
    );
    return value;
  }

  // Convert to base, then to target
  const baseValue = value * fromDef.factor;
  return baseValue / toDef.factor;
}

/**
 * Normalizes a value/unit pair to the most appropriate US Customary unit.
 * E.g., 3785ml -> 1 gal, 0.5 kg -> 1.1 lb
 */
export function normalizeToUS(
  value: number,
  unit: UnitKey,
): { value: number; unit: UnitKey } {
  const def = UNITS_DB[unit];
  if (!def) return { value, unit };

  if (def.category === "count") return { value, unit }; // No normalization for counts yet

  // Target units to check against (descending order of size)
  const volumeTargets: UnitKey[] = ["gal", "qt", "pt", "cup", "fl_oz"];
  const weightTargets: UnitKey[] = ["lb", "oz"];

  const targets = def.category === "volume" ? volumeTargets : weightTargets;

  // Convert to base unit first (fl_oz or oz)
  // We can just use the factor because 'fl_oz' and 'oz' have factor 1.
  const baseValue = value * def.factor;

  // Try to find a target unit where the value is >= 1 (or close to a "nice" fraction)
  // For now, let's try to match the largest unit where value >= 0.9 OR it's very close to a round number.
  // Actually, let's just convert to the standard base units as per PRD requirement 2:
  // "Convert all liquid inputs to a standard base (e.g., fl oz or Gallon)... defaulting to US units."

  // Implementation strategy:
  // 1. If it's effectively a whole Gallon/Quart/Pint (within small margin), switch to that.
  // 2. Otherwise default to fl_oz / oz for consistency, UNLESS it's massive.

  for (const target of targets) {
    const converted = convertUnit(value, unit, target);

    // Check if it's close to an integer (e.g. 1.0, 2.0, 0.5 is fine too if we handle fractions, but let's stick to integers for "clean" units)
    // Tolerance 0.1 (Accommodates 1L -> 1.057qt)
    if (
      Math.abs(converted - Math.round(converted)) < 0.1 &&
      Math.round(converted) > 0
    ) {
      return { value: Math.round(converted), unit: target };
    }

    // If it's a simple fraction like 0.5 (half gallon), maybe keep it?
    // For now, let's prioritize the Base Unit (fl_oz / oz) if it doesn't match a larger unit cleanly,
    // UNLESS the base unit value is huge (e.g. 1000 fl oz).
  }

  // Fallback to base unit (fl_oz or oz)
  const baseUnit = def.category === "volume" ? "fl_oz" : "oz";
  return { value: Number(baseValue.toFixed(2)), unit: baseUnit };
}

export function getBaseUSUnit(category: UnitCategory): UnitKey {
  switch (category) {
    case "volume":
      return "fl_oz";
    case "weight":
      return "oz";
    default:
      return "unit";
  }
}
