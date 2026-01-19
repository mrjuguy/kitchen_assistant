/**
 * Simple matcher to handle ingredient name variances like "Tomato" vs "Tomatoes"
 */
export const normalizeName = (name: string): string => {
    return name.toLowerCase().trim()
        .replace(/ies$/, 'y')
        .replace(/es$/, '')
        .replace(/s$/, '');
};

const IDENTITY_MODIFIERS = ['peanut', 'almond', 'cashew', 'coconut', 'soy', 'oat', 'cocoa'];

export const isMatch = (name1: string, name2: string): boolean => {
    const n1 = normalizeName(name1);
    const n2 = normalizeName(name2);

    // Exact match is always safe
    if (n1 === n2) return true;

    // Check identity modifiers (e.g. preventing "Peanut Butter" matching "Butter")
    for (const mod of IDENTITY_MODIFIERS) {
        // If one contains the modifier and the other doesn't, it's not a match
        // (e.g. "Peanut Butter" vs "Butter")
        if (n1.includes(mod) !== n2.includes(mod)) {
            return false;
        }
    }

    return n1.includes(n2) || n2.includes(n1);
};

export const checkAllergen = (
    recipeAllergens: string[],
    userAllergens: string[],
    ingredientNames: string[] = []
): string | null => {
    if (!userAllergens || userAllergens.length === 0) return null;

    // 1. Check explicit recipe tags
    const foundTag = recipeAllergens?.find(allergen =>
        userAllergens.some(userAllergen => isMatch(allergen, userAllergen))
    );
    if (foundTag) return foundTag;

    // 2. Check ingredient names
    // This is a simple check; "Peanut Butter" contains "Peanut"
    const foundIngredient = ingredientNames.find(ingName =>
        userAllergens.some(userAllergen => isMatch(ingName, userAllergen))
    );

    return foundIngredient || null;
};
