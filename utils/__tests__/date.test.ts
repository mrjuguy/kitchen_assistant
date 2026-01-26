import {
  addDays,
  addMonths,
  addYears,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfToday,
} from "date-fns";

import { calculateSmartDate } from "../date";

describe("calculateSmartDate", () => {
  const today = startOfToday();
  const endOfDay = (date: Date) =>
    setMilliseconds(setSeconds(setMinutes(setHours(date, 23), 59), 59), 999);

  it("calculates +3 days correctly", () => {
    const expected = endOfDay(addDays(today, 3));
    expect(calculateSmartDate({ type: "days", value: 3 }).getTime()).toBe(
      expected.getTime(),
    );
  });

  it("calculates +1 week correctly", () => {
    const expected = endOfDay(addDays(today, 7));
    expect(calculateSmartDate({ type: "weeks", value: 1 }).getTime()).toBe(
      expected.getTime(),
    );
  });

  it("calculates +1 month correctly", () => {
    const expected = endOfDay(addMonths(today, 1));
    expect(calculateSmartDate({ type: "months", value: 1 }).getTime()).toBe(
      expected.getTime(),
    );
  });

  it("calculates +1 year correctly", () => {
    const expected = endOfDay(addYears(today, 1));
    expect(calculateSmartDate({ type: "years", value: 1 }).getTime()).toBe(
      expected.getTime(),
    );
  });
});
