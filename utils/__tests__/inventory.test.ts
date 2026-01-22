
import { PantryItem } from '../../types/schema';
import { groupItemsByLocation } from '../inventory';

describe('groupItemsByLocation', () => {
    const mockItems: PantryItem[] = [
        { id: '1', name: 'Milk', storage_location: 'fridge', category: 'Dairy' } as PantryItem,
        { id: '2', name: 'Ice Cream', storage_location: 'freezer', category: 'Frozen' } as PantryItem,
        { id: '3', name: 'Flour', storage_location: 'pantry', category: 'Pantry' } as PantryItem,
        { id: '4', name: 'Apples', category: 'Produce' } as PantryItem, // No location, should default to Pantry
    ];

    it('should split items into Fridge, Freezer, and Pantry sections', () => {
        const result = groupItemsByLocation(mockItems);

        expect(result).toHaveLength(3);
        const fridge = result.find(s => s.title === 'Fridge');
        const freezer = result.find(s => s.title === 'Freezer');
        const pantry = result.find(s => s.title === 'Pantry');

        expect(fridge?.data).toHaveLength(1);
        expect(fridge?.data[0].name).toBe('Milk');

        expect(freezer?.data).toHaveLength(1);
        expect(freezer?.data[0].name).toBe('Ice Cream');

        expect(pantry?.data).toHaveLength(2); // Flour + Apples (default)
        const names = pantry?.data.map(i => i.name).sort();
        expect(names).toEqual(['Apples', 'Flour']);
    });

    it('should handle empty input', () => {
        const result = groupItemsByLocation([]);
        expect(result).toHaveLength(3);
        expect(result[0].data).toHaveLength(0);
        expect(result[1].data).toHaveLength(0);
        expect(result[2].data).toHaveLength(0);
    });
});
