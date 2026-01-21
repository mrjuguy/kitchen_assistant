import { NutritionalInfo } from '../types/schema';

export interface ProductData {
    name: string;
    category: string;
    barcode?: string;
    image_url?: string;
    brand?: string;
    quantity?: number;
    unit?: string;
    nutritional_info?: NutritionalInfo;
    ingredients_text?: string;
    allergens?: string[];
    labels?: string[];
}

const mapOFFCategory = (offCategories: string[] = []): string => {
    if (offCategories.includes('en:fruits') || offCategories.includes('en:vegetables')) return 'Produce';
    if (offCategories.includes('en:dairies')) return 'Dairy';
    if (offCategories.includes('en:meats') || offCategories.includes('en:proteins')) return 'Protein';
    if (offCategories.includes('en:frozen-foods')) return 'Frozen';
    if (offCategories.includes('en:snacks')) return 'Snacks';
    if (offCategories.includes('en:beverages')) return 'Beverages';
    if (offCategories.includes('en:pastries') || offCategories.includes('en:bakery-products')) return 'Bakery';
    return 'Pantry';
};

export const fetchProductByBarcode = async (barcode: string): Promise<ProductData | null> => {
    try {
        const response = await fetch(`https://us.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1) {
            const product = data.product;

            return {
                name: product.product_name || 'Unknown Product',
                category: mapOFFCategory(product.categories_tags),
                image_url: product.image_url || product.image_front_url,
                brand: product.brands,
                quantity: (() => {
                    // 1. Try explicit float
                    if (product.product_quantity) return parseFloat(product.product_quantity);

                    // 2. Try parsing string "quantity" field (e.g. "946 ml")
                    if (product.quantity) {
                        const match = product.quantity.match(/([0-9.]+)\s*([a-zA-Z%]+)/);
                        if (match) return parseFloat(match[1]);
                    }
                    return undefined;
                })(),
                unit: (() => {
                    // 1. Try explicit unit
                    if (product.product_quantity_unit) return product.product_quantity_unit;

                    // 2. Try parsing string "quantity" field
                    if (product.quantity) {
                        const match = product.quantity.match(/([0-9.]+)\s*([a-zA-Z%]+)/);
                        if (match) return match[2].toLowerCase();
                    }
                    return undefined;
                })(),
                nutritional_info: {
                    calories: product.nutriments?.['energy-kcal_100g'],
                    proteins: product.nutriments?.proteins_100g,
                    carbohydrates: product.nutriments?.carbohydrates_100g,
                    fat: product.nutriments?.fat_100g,
                    sugar: product.nutriments?.sugars_100g,
                    fiber: product.nutriments?.fiber_100g,
                },
                ingredients_text: product.ingredients_text,
                allergens: product.allergens_tags || [],
                labels: product.labels_tags || [],
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return null;
    }
};

export const searchProducts = async (query: string): Promise<ProductData[]> => {
    if (!query || query.length < 3) return [];
    try {
        const response = await fetch(`https://us.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`);
        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
            return data.products.map((product: any) => ({
                name: product.product_name || 'Unknown Product',
                category: mapOFFCategory(product.categories_tags),
                image_url: product.image_url_small || product.image_front_small_url || product.image_thumb_url,
                brand: product.brands,
                barcode: product.code,
                nutritional_info: {
                    calories: product.nutriments?.['energy-kcal_100g'],
                    proteins: product.nutriments?.proteins_100g,
                    carbohydrates: product.nutriments?.carbohydrates_100g,
                    fat: product.nutriments?.fat_100g,
                    sugar: product.nutriments?.sugars_100g,
                    fiber: product.nutriments?.fiber_100g,
                },
                ingredients_text: product.ingredients_text,
                allergens: product.allergens_tags || [],
                labels: product.labels_tags || [],
            }));
        }
        return [];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};
