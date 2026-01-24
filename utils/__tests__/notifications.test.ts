import { addDays, startOfToday } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { scheduleExpiryNotification } from '../notifications';
import { PantryItem } from '../types/schema';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
    scheduleNotificationAsync: jest.fn(),
    SchedulableTriggerInputTypes: {
        DATE: 'date',
    },
}));

describe('scheduleExpiryNotification', () => {
    const today = startOfToday();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockItem = (daysFromNow: number): PantryItem => ({
        id: '123',
        name: 'Test Food',
        expiry_date: addDays(today, daysFromNow).toISOString(),
    } as any);

    it('should schedule both warning and critical alerts for items expiring in 10 days', async () => {
        await scheduleExpiryNotification(mockItem(10));

        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(2);

        // Warning (7 days before) -> 3 days from now
        const expectedWarningDate = addDays(today, 3);
        const warningCall = (Notifications.scheduleNotificationAsync as jest.Mock).mock.calls.find(call =>
            call[0].content.title === "Freshness Warning"
        );
        expect(warningCall).toBeTruthy();
        expect(warningCall[0].trigger.date.toDateString()).toBe(expectedWarningDate.toDateString());

        // Critical (2 days before) -> 8 days from now
        const expectedCriticalDate = addDays(today, 8);
        const criticalCall = (Notifications.scheduleNotificationAsync as jest.Mock).mock.calls.find(call =>
            call[0].content.title === "Critically Low Freshness"
        );
        expect(criticalCall).toBeTruthy();
        expect(criticalCall[0].trigger.date.toDateString()).toBe(expectedCriticalDate.toDateString());
    });

    it('should ONLY schedule critical alert for items expiring in 4 days (warning date passed)', async () => {
        // Expiry in 4 days.
        // Warning would be (4-7) = -3 days ago. Should NOT schedule.
        // Critical would be (4-2) = 2 days from now. Should schedule.
        await scheduleExpiryNotification(mockItem(4));

        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
        const call = (Notifications.scheduleNotificationAsync as jest.Mock).mock.calls[0][0];
        expect(call.content.title).toBe("Critically Low Freshness");
    });

    it('should NOT schedule anything for items expiring tomorrow', async () => {
        // Expiry in 1 day.
        // Critical would be (1-2) = -1 day ago.
        await scheduleExpiryNotification(mockItem(1));
        expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('should NOT schedule anything if no expiry date', async () => {
        const item = { ...mockItem(0), expiry_date: null } as any;
        await scheduleExpiryNotification(item);
        expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
});
