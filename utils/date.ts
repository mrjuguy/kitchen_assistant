import { addDays, addMonths, addYears, setHours, setMilliseconds, setMinutes, setSeconds, startOfToday } from 'date-fns';

export const getWeekDays = (baseDate: Date = new Date()) => {
    const days = [];
    const start = new Date(baseDate);
    // Start from the beginning of the week (Monday)
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
    }
    return days;
};

export const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

export const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayNumber = (date: Date) => {
    return date.getDate();
};


export type DateOffset =
    | { type: 'days'; value: number }
    | { type: 'weeks'; value: number }
    | { type: 'months'; value: number }
    | { type: 'years'; value: number };

/**
 * Calculates a date based on an offset from today, 
 * regularizing to the end of the day to avoid timezone/DST pitfalls in storage.
 */
export const calculateSmartDate = (offset: DateOffset): Date => {
    const today = startOfToday();
    let targetDate: Date;

    switch (offset.type) {
        case 'days':
            targetDate = addDays(today, offset.value);
            break;
        case 'weeks':
            targetDate = addDays(today, offset.value * 7);
            break;
        case 'months':
            targetDate = addMonths(today, offset.value);
            break;
        case 'years':
            targetDate = addYears(today, offset.value);
            break;
    }

    // Set to 23:59:59 to ensure it counts as "that day" across most timezones when converted to UTC
    return setMilliseconds(setSeconds(setMinutes(setHours(targetDate, 23), 59), 59), 999);
};

export const SMART_DATE_OPTIONS = [
    { label: '+3 Days', offset: { type: 'days', value: 3 } as DateOffset },
    { label: '+1 Week', offset: { type: 'weeks', value: 1 } as DateOffset },
    { label: '+1 Month', offset: { type: 'months', value: 1 } as DateOffset },
    { label: '+1 Year', offset: { type: 'years', value: 1 } as DateOffset },
];

export const getLabelForDate = (date: Date | null): string | null => {
    if (!date) return null;
    const dateStr = date.toDateString();
    for (const option of SMART_DATE_OPTIONS) {
        const smartDate = calculateSmartDate(option.offset);
        if (smartDate.toDateString() === dateStr) {
            return option.label;
        }
    }
    return null;
};
