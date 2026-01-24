import { isBefore, startOfToday, subDays } from 'date-fns';
import { PantryItem } from '../types/schema';

import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const scheduleExpiryNotification = async (item: PantryItem) => {
    if (isExpoGo) {
        console.log('[Dev] Notification would be scheduled for:', item.name);
        return;
    }

    // Lazy load to avoid side-effects in Expo Go
    const Notifications = require('expo-notifications');
    if (isExpoGo) {
        console.log('[Dev] Notification would be scheduled for:', item.name);
        return;
    }

    if (!item.expiry_date) return;

    try {
        const expiryDate = new Date(item.expiry_date);
        const today = startOfToday();

        if (isBefore(expiryDate, today)) return;

        const criticalDate = subDays(expiryDate, 2);
        if (isBefore(today, criticalDate)) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Critically Low Freshness",
                    body: `${item.name} is expiring in 2 days! Plan a meal now.`,
                    data: { itemId: item.id },
                },
                trigger: {
                    date: criticalDate,
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                }
            });
        }

        const warningDate = subDays(expiryDate, 7);
        if (isBefore(today, warningDate)) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Freshness Warning",
                    body: `${item.name} expires in 1 week.`,
                    data: { itemId: item.id },
                },
                trigger: {
                    date: warningDate,
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                }
            });
        }
    } catch (error) {
        console.warn('Failed to schedule notification:', error);
    }
};
