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
