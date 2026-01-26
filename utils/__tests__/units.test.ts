import { convertUnit, normalizeToUS } from "../units";

describe("Unit Utilities", () => {
  describe("convertUnit", () => {
    it("should convert gallons to fluid ounces", () => {
      expect(convertUnit(1, "gal", "fl_oz")).toBe(128);
    });

    it("should convert fluid ounces to gallons", () => {
      expect(convertUnit(128, "fl_oz", "gal")).toBe(1);
    });

    it("should convert liters to fluid ounces", () => {
      const result = convertUnit(1, "l", "fl_oz");
      expect(result).toBeCloseTo(33.814, 2);
    });

    it("should convert kilograms to pounds", () => {
      const result = convertUnit(1, "kg", "lb");
      expect(result).toBeCloseTo(2.2046, 2); // 1kg is approx 2.2046lb, 35.274 oz / 16 = 2.204625
    });

    it("should handle same unit conversion", () => {
      expect(convertUnit(10, "g", "g")).toBe(10);
    });

    it("should return original value for invalid units", () => {
      expect(convertUnit(10, "unknown" as any, "gal")).toBe(10);
      expect(convertUnit(10, "gal", "unknown" as any)).toBe(10);
    });

    it("should return original value for cross-category conversion", () => {
      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      expect(convertUnit(10, "gal", "lb")).toBe(10);
      consoleSpy.mockRestore();
    });
  });

  describe("normalizeToUS", () => {
    it("should normalize 3785ml to 1 gallon (approx)", () => {
      // 3785 ml = 127.98 fl oz. -> Should be close enough to 128 fl oz (1 gal) with our margin?
      // 3785 * 0.033814 = 127.986
      // 127.986 / 128 = 0.9998 -> Round to 1.
      const { value, unit } = normalizeToUS(3785, "ml");
      expect(value).toBe(1);
      expect(unit).toBe("gal");
    });

    it("should normalize 1000ml to 1 qt (with tolerance)", () => {
      // 1 liter = 33.814 fl oz. 33.8 / 32 = 1.056.
      // With tolerance 0.1, this should now be 1 Qt.
      const { value, unit } = normalizeToUS(1000, "ml");
      expect(unit).toBe("qt");
      expect(value).toBe(1);
    });

    it("should normalize 500g to approx 1.1 lb or 17.6 oz", () => {
      // 500g * 0.035274 = 17.637 oz.
      // 17.637 / 16 = 1.10 lb. Not close to integer.
      // Should fallback to oz.
      const { value, unit } = normalizeToUS(500, "g");
      expect(unit).toBe("oz");
      expect(value).toBeCloseTo(17.64, 1);
    });

    it("should normalize 454g (1lb) to 1 lb", () => {
      // 454 * 0.035274 = 16.014... oz.
      // 16.014 / 16 = 1.0009.
      // Should be 1 lb.
      const { value, unit } = normalizeToUS(454, "g");
      expect(unit).toBe("lb");
      expect(value).toBe(1);
    });
  });
});
