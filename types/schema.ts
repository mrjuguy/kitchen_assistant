export interface NutritionalInfo {
  calories?: number;
  proteins?: number;
  carbohydrates?: number;
  fat?: number;
  sugar?: number;
  fiber?: number;
}

export interface Household {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface HouseholdMember {
  household_id: string;
  user_id: string;
  role: "admin" | "member";
  created_at: string;
}

export interface PantryItem {
  id: string;
  user_id: string;
  household_id: string; // Added
  name: string;
  quantity: number;
  unit: string;
  total_capacity?: number; // The original full amount (e.g. 12 oz) for relative sliders
  category: string;
  storage_location?: "pantry" | "fridge" | "freezer";
  expiry_date?: string;
  barcode?: string;
  image_url?: string;
  brand?: string;
  nutritional_info?: NutritionalInfo;
  ingredients_text?: string;
  allergens?: string[];
  labels?: string[];
  created_at: string;
  updated_at: string;
}

export interface CommonInventoryItemData {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  barcode?: string;
  image_url?: string;
  brand?: string;
  nutritional_info?: NutritionalInfo;
  ingredients_text?: string;
  allergens?: string[];
  labels?: string[];
}

export type CreatePantryItem = CommonInventoryItemData & {
  storage_location?: "pantry" | "fridge" | "freezer";
  expiry_date?: string;
  total_capacity?: number;
  household_id?: string;
};

export type UpdatePantryItem = Partial<
  Omit<PantryItem, "id" | "created_at" | "user_id" | "household_id">
>;

export interface ShoppingItem {
  id: string;
  user_id: string;
  household_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  bought: boolean;
  barcode?: string;
  image_url?: string;
  brand?: string;
  nutritional_info?: NutritionalInfo;
  ingredients_text?: string;
  allergens?: string[];
  labels?: string[];
  created_at: string;
}

export type CreateShoppingItem = CommonInventoryItemData & {
  bought?: boolean;
  household_id?: string;
};
export type UpdateShoppingItem = Partial<ShoppingItem>;

export interface UserProfile {
  id: string; // matches auth.uid()
  display_name: string;
  allergens: string[];
  dietary_preferences: string[];
  created_at: string;
}

export type CreateUserProfile = Omit<UserProfile, "id" | "created_at">;
export type UpdateUserProfile = Partial<CreateUserProfile>;

export interface Recipe {
  id: string;
  user_id: string;
  household_id: string; // Added
  name: string;
  description?: string;
  instructions: string[];
  image_url?: string;
  prep_time?: number; // in minutes
  cook_time?: number; // in minutes
  servings?: number;
  tags: string[]; // for Keto, Vegan, etc.
  allergens: string[]; // list of allergens present in the recipe
  author?: string;
  source_url?: string;
  difficulty?: "easy" | "medium" | "hard";
  calories?: number;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: RecipeIngredient[];
}

export type CreateRecipe = Omit<
  Recipe,
  "id" | "created_at" | "user_id" | "household_id"
> & { household_id?: string };

export interface MealPlan {
  id: string;
  user_id: string;
  household_id: string; // Added
  date: string; // ISO date string (YYYY-MM-DD)
  meal_type: "breakfast" | "lunch" | "dinner";
  recipe_id: string;
  created_at: string;
  // joined fields
  recipe?: RecipeWithIngredients;
}

export type CreateMealPlan = Omit<
  MealPlan,
  "id" | "created_at" | "user_id" | "household_id" | "recipe"
> & { household_id?: string };

export interface UsageLog {
  id: string;
  user_id: string;
  household_id: string;
  item_name: string;
  action: "consumed" | "expired" | "discarded" | "donated";
  quantity?: number;
  unit?: string;
  logged_at: string;
}

export type CreateUsageLog = Omit<UsageLog, "id" | "logged_at">;
