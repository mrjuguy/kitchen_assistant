import { differenceInDays, isPast, isToday, startOfDay } from 'date-fns';

export type ItemHealthStatus = 'good' | 'warning' | 'critical' | 'expired' | 'unknown';

export interface ItemHealthInfo {
    status: ItemHealthStatus;
    label: string;
    color: string;
    daysRemaining: number | null;
}

export const getItemHealth = (expiryDateString: string | null | undefined): ItemHealthInfo => {
    if (!expiryDateString) {
        return {
            status: 'unknown',
            label: 'No Expiry',
            color: '#6b7280',
            daysRemaining: null
        };
    }

    const expiryDate = startOfDay(new Date(expiryDateString));
    const today = startOfDay(new Date());

    if (isPast(expiryDate) && !isToday(expiryDate)) {
        return {
            status: 'expired',
            label: 'Expired',
            color: '#ef4444',
            daysRemaining: differenceInDays(expiryDate, today)
        };
    }

    if (isToday(expiryDate)) {
        return {
            status: 'critical',
            label: 'Today',
            color: '#ef4444',
            daysRemaining: 0
        };
    }

    const daysRemaining = differenceInDays(expiryDate, today);

    if (daysRemaining < 3) {
        return {
            status: 'critical',
            label: daysRemaining === 0 ? 'Today' : daysRemaining === 1 ? 'Tomorrow' : `${daysRemaining} days left`,
            color: '#ef4444',
            daysRemaining
        };
    }

    if (daysRemaining <= 7) {
        return {
            status: 'warning',
            label: `${daysRemaining} days left`,
            color: '#f59e0b',
            daysRemaining
        };
    }

    return {
        status: 'good',
        label: `${daysRemaining} days left`,
        color: '#22c55e',
        daysRemaining
    };
};
