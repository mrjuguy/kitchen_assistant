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

export interface ShoppingItem {
    id: string;
    user_id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    bought: boolean;
    barcode?: string;
    image_url?: string;
    created_at: string;
}

export type CreateShoppingItem = Omit<ShoppingItem, 'id' | 'created_at' | 'user_id' | 'bought'>;
export type UpdateShoppingItem = Partial<ShoppingItem>;

export interface Recipe {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    instructions: string[];
    image_url?: string;
    prep_time?: number; // in minutes
    cook_time?: number; // in minutes
    created_at: string;
}

export interface RecipeIngredient {
    id: string;
    recipe_id: string;
    name: string;
    quantity: number;
    unit: string;
}

export type CreateRecipe = Omit<Recipe, 'id' | 'created_at' | 'user_id'>;
