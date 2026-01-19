export interface PantryItem {
    id: string;
    user_id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    expiry_date?: string;
    barcode?: string;
    image_url?: string;
    created_at: string;
}

export type CreatePantryItem = Omit<PantryItem, 'id' | 'created_at' | 'user_id'>;
export type UpdatePantryItem = Partial<CreatePantryItem>;
