export interface ProductData {
    name: string;
    category: string;
    image_url?: string;
    brand?: string;
}

export const fetchProductByBarcode = async (barcode: string): Promise<ProductData | null> => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1) {
            const product = data.product;

            // Map OFF categories to our app categories
            let category = 'Pantry';
            const offCategories = product.categories_tags || [];

            if (offCategories.includes('en:fruits') || offCategories.includes('en:vegetables')) category = 'Produce';
            else if (offCategories.includes('en:dairies')) category = 'Dairy';
            else if (offCategories.includes('en:meats') || offCategories.includes('en:proteins')) category = 'Protein';
            else if (offCategories.includes('en:frozen-foods')) category = 'Frozen';
            else if (offCategories.includes('en:snacks') || offCategories.includes('en:beverages')) category = 'Pantry';

            return {
                name: product.product_name || 'Unknown Product',
                category: category,
                image_url: product.image_url || product.image_front_url,
                brand: product.brands,
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return null;
    }
};
