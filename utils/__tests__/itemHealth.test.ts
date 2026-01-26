import { addDays, startOfToday, subDays } from "date-fns";

import { getItemHealth } from "../itemHealth";

describe("getItemHealth", () => {
  const today = startOfToday();

  const getIsoDate = (date: Date) => date.toISOString().split("T")[0];

  it("returns good for null or undefined expiry date", () => {
    const health = getItemHealth(null);
    expect(health.status).toBe("good");
    expect(health.label).toBe("Fresh");
  });

  it("returns expired for past dates", () => {
    const yesterday = subDays(today, 1);
    const health = getItemHealth(getIsoDate(yesterday));
    expect(health.status).toBe("expired");
    expect(health.label).toBe("Expired");
    expect(health.daysRemaining).toBe(-1);
  });

  it("returns critical for today", () => {
    const health = getItemHealth(getIsoDate(today));
    expect(health.status).toBe("critical");
    expect(health.label).toBe("Expires today");
    expect(health.daysRemaining).toBe(0);
  });

  it("returns critical for 2 days from now", () => {
    const inTwoDays = addDays(today, 2);
    const health = getItemHealth(getIsoDate(inTwoDays));
    expect(health.status).toBe("critical");
    expect(health.label).toBe("Expires in 2d");
  });

  it("returns warning for 3 days from now", () => {
    const inThreeDays = addDays(today, 3);
    const health = getItemHealth(getIsoDate(inThreeDays));
    expect(health.status).toBe("warning");
    expect(health.label).toBe("Expires in 3d");
  });

  it("returns warning for 7 days from now", () => {
    const inSevenDays = addDays(today, 7);
    const health = getItemHealth(getIsoDate(inSevenDays));
    expect(health.status).toBe("warning");
    expect(health.label).toBe("Expires in 7d");
  });

  it("returns good for 8 days from now", () => {
    const inEightDays = addDays(today, 8);
    const health = getItemHealth(getIsoDate(inEightDays));
    expect(health.status).toBe("good");
    expect(health.label).toBe("Expires in 8d");
  });
});
