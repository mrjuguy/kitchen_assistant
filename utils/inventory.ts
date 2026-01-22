import { PantryItem } from '../types/schema';

export const groupItemsByLocation = (items: PantryItem[]) => {
    const grouped = {
        Fridge: [] as PantryItem[],
        Freezer: [] as PantryItem[],
        Pantry: [] as PantryItem[],
    };

    items.forEach(item => {
        const loc = item.storage_location || 'pantry'; // Default to pantry
        if (loc === 'fridge') grouped.Fridge.push(item);
        else if (loc === 'freezer') grouped.Freezer.push(item);
        else grouped.Pantry.push(item);
    });

    return [
        { title: 'Fridge', data: grouped.Fridge },
        { title: 'Freezer', data: grouped.Freezer },
        { title: 'Pantry', data: grouped.Pantry },
    ];
};
