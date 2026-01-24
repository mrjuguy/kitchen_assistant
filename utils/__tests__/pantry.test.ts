import { addDays, startOfToday, subDays } from 'date-fns';
import { getItemHealth } from '../pantry';

describe('getItemHealth', () => {
    const today = startOfToday();

    it('returns unknown if no date provided', () => {
        const result = getItemHealth(null);
        expect(result.status).toBe('unknown');
        expect(result.label).toBe('No Expiry');
    });

    it('returns expired for past dates', () => {
        const past = subDays(today, 1).toISOString();
        const result = getItemHealth(past);
        expect(result.status).toBe('expired');
        expect(result.label).toBe('Expired');
        expect(result.color).toBe('#ef4444');
    });

    it('returns critical for today', () => {
        const todayStr = today.toISOString();
        const result = getItemHealth(todayStr);
        expect(result.status).toBe('critical');
        expect(result.label).toBe('Today');
        expect(result.color).toBe('#ef4444');
    });

    it('returns critical for tomorrow', () => {
        const tomorrow = addDays(today, 1).toISOString();
        const result = getItemHealth(tomorrow);
        expect(result.status).toBe('critical');
        expect(result.label).toBe('Tomorrow');
    });

    it('returns critical for 2 days left', () => {
        const twoDays = addDays(today, 2).toISOString();
        const result = getItemHealth(twoDays);
        expect(result.status).toBe('critical');
    });

    it('returns warning for 3 days left', () => {
        const threeDays = addDays(today, 3).toISOString();
        const result = getItemHealth(threeDays);
        expect(result.status).toBe('warning');
        expect(result.label).toBe('3 days left');
        expect(result.color).toBe('#f59e0b');
    });

    it('returns warning for 7 days left', () => {
        const sevenDays = addDays(today, 7).toISOString();
        const result = getItemHealth(sevenDays);
        expect(result.status).toBe('warning');
        expect(result.label).toBe('7 days left');
    });

    it('returns good for 8 days left', () => {
        const eightDays = addDays(today, 8).toISOString();
        const result = getItemHealth(eightDays);
        expect(result.status).toBe('good');
        expect(result.label).toBe('8 days left');
        expect(result.color).toBe('#22c55e');
    });
});
