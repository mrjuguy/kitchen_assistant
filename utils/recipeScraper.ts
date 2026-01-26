import { CreateRecipe, RecipeIngredient } from "../types/schema";

interface ScrapedRecipe extends CreateRecipe {
  ingredients: Omit<RecipeIngredient, "id" | "recipe_id">[];
}

/**
 * Extracts a recipe from a URL by parsing JSON-LD data.
 * Falls back to basic meta tag scraping if JSON-LD is missing (future scope).
 */
export async function extractRecipeFromUrl(
  url: string,
): Promise<ScrapedRecipe | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.warn("Failed to fetch URL:", response.status);
      return null;
    }

    const text = await response.text();
    const jsonLdData = extractJsonLd(text);

    if (!jsonLdData) {
      console.warn("No JSON-LD found");
      return null;
    }

    return mapJsonLdToRecipe(jsonLdData, url);
  } catch (error) {
    console.error("Error in extractRecipeFromUrl:", error);
    return null;
  }
}

interface JsonLdRecipe {
  "@type"?: string | string[];
  name?: string;
  description?: string;
  image?: string | string[] | { url?: string;[key: string]: any };
  recipeInstructions?: string | any[];
  recipeIngredient?: string | string[];
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string | number;
  author?: string | any[] | { name?: string;[key: string]: any };
  keywords?: string | string[];
  [key: string]: any;
}

/**
 * Regex-based JSON-LD extractor.
 * Finds <script type="application/ld+json">...</script> blocks.
 */
function extractJsonLd(html: string): JsonLdRecipe | null {
  // Regex to capture content inside JSON-LD script tags
  const regex =
    /<script\s+[^>]*?type=["']application\/ld\+json["'][^>]*?>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const content = match[1];
    try {
      const json = JSON.parse(content);
      const recipe = findRecipeInJson(json);
      if (recipe) return recipe;
    } catch (e) {
      console.log("JSON Parse failed for block", e);
    }
  }
  return null;
}

/**
 * Traverses JSON (could be object, array, or graph) to find @type "Recipe"
 */
function findRecipeInJson(data: any): JsonLdRecipe | null {
  if (!data) return null;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInJson(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof data === "object") {
    const type = data["@type"];
    if (type) {
      if (Array.isArray(type)) {
        if (type.includes("Recipe")) return data as JsonLdRecipe;
      } else if (type === "Recipe") {
        return data as JsonLdRecipe;
      }
    }

    // Check @graph
    if (data["@graph"]) {
      return findRecipeInJson(data["@graph"]);
    }
  }

  return null;
}

function mapJsonLdToRecipe(
  data: JsonLdRecipe,
  sourceUrl: string,
): ScrapedRecipe {
  const name = decodeHtmlEntities(data.name || "Untitled Recipe");
  const description = decodeHtmlEntities(data.description || "");

  // Image can be object, array, or string
  let image_url: string | undefined;
  if (typeof data.image === "string") {
    image_url = data.image;
  } else if (Array.isArray(data.image) && data.image.length > 0) {
    const first = data.image[0];
    image_url = typeof first === "string" ? first : (first as any).url;
  } else if (
    data.image &&
    typeof data.image === "object" &&
    !Array.isArray(data.image)
  ) {
    image_url = (data.image as any).url;
  }

  // Instructions
  let instructions: string[] = [];
  if (data.recipeInstructions) {
    if (Array.isArray(data.recipeInstructions)) {
      instructions = data.recipeInstructions
        .map((i: any) => {
          if (typeof i === "string") return i;
          if (i.text) return i.text;
          return "";
        })
        .filter((s: string) => s.length > 0);
    } else if (typeof data.recipeInstructions === "string") {
      instructions = [data.recipeInstructions];
    }
  }

  instructions = instructions.map(decodeHtmlEntities);

  // Ingredients
  let ingredientsRaw: string[] = [];
  if (data.recipeIngredient) {
    if (Array.isArray(data.recipeIngredient)) {
      ingredientsRaw = data.recipeIngredient;
    } else if (typeof data.recipeIngredient === "string") {
      ingredientsRaw = [data.recipeIngredient];
    }
  }

  const ingredients = ingredientsRaw.map(parseIngredient).map((i) => ({
    name: decodeHtmlEntities(i.name),
    quantity: i.quantity,
    unit: i.unit,
  }));

  // Durations (ISO 8601 PT..)
  const prep_time = parseIsoDuration(data.prepTime || "");
  const cook_time = parseIsoDuration(data.cookTime || "");
  const servings = parseServings(data.recipeYield);

  // Author
  let author: string | undefined;
  if (data.author) {
    if (typeof data.author === "string") {
      author = data.author;
    } else if (Array.isArray(data.author) && data.author.length > 0) {
      const firstAuthor = data.author[0];
      author = typeof firstAuthor === "string" ? firstAuthor : firstAuthor.name;
    } else if (typeof data.author === "object") {
      author = (data.author as any).name;
    }
  }
  if (author) author = decodeHtmlEntities(author);

  return {
    name,
    description,
    instructions,
    image_url,
    prep_time,
    cook_time,
    servings,
    author,
    source_url: sourceUrl,
    calories: data.nutrition?.calories
      ? parseInt(data.nutrition.calories.match(/\d+/)?.[0] || "0", 10)
      : undefined,
    difficulty: undefined, // Usually not available in machine-readable format
    tags: data.keywords
      ? typeof data.keywords === "string"
        ? data.keywords.split(",")
        : data.keywords
      : [],
    allergens: [], // Cannot reliably extract from standard schema without NLP
    ingredients,
  };
}

function parseServings(yieldData: any): number | undefined {
  if (!yieldData) return undefined;
  if (typeof yieldData === "number") return yieldData;
  if (typeof yieldData === "string") {
    const match = yieldData.match(/\d+/);
    if (match) return parseInt(match[0], 10);
  }
  return undefined;
}

export function parseIsoDuration(duration: string): number | undefined {
  if (!duration) return undefined;
  // Simple parser for PT1H30M format
  const match = duration.match(/PT(\d+H)?(\d+M)?/); // Very basic
  if (!match) return undefined;

  let minutes = 0;
  if (match[1]) minutes += parseInt(match[1].replace("H", ""), 10) * 60;
  if (match[2]) minutes += parseInt(match[2].replace("M", ""), 10);

  return minutes > 0 ? minutes : undefined;
}

export function parseIngredient(raw: string): {
  name: string;
  quantity: number;
  unit: string;
} {
  // Very Basic Parser: "1 cup flour"
  const cleaned = raw.trim();

  // Regex for "number unit rest"
  // Supports fractions 1/2, ranges 1-2, decimals 1.5
  const regex = /^([\d./-\s]+)?\s*([a-zA-Z]+)?\s+(.*)$/;
  const match = cleaned.match(regex);

  if (!match) {
    return { name: cleaned, quantity: 1, unit: "unit" };
  }

  // Parse quantity
  let quantity = 1;
  const qtyStr = match[1]?.trim();
  if (qtyStr) {
    if (qtyStr.includes("/")) {
      const parts = qtyStr.split("/");
      if (parts.length === 2)
        quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else if (qtyStr.includes("-")) {
      // Take average? Lower bound? Let's take lower bound for now.
      quantity = parseFloat(qtyStr.split("-")[0]);
    } else {
      quantity = parseFloat(qtyStr);
    }
  }

  if (isNaN(quantity)) quantity = 1;

  // Unit
  const unit = match[2]?.toLowerCase() || "unit";
  const name = match[3]?.trim() || "";

  // Normalize unit if possible (simple mapping)
  // We should use UNITS_DB keys if possible
  const normalizedUnit = normalizeUnitString(unit);

  return {
    name,
    quantity,
    unit: normalizedUnit,
  };
}

function normalizeUnitString(u: string): string {
  const map: Record<string, string> = {
    cups: "cup",
    tablespoons: "tbsp",
    tablespoon: "tbsp",
    teaspoons: "tsp",
    teaspoon: "tsp",
    ounces: "oz",
    ounce: "oz",
    pounds: "lb",
    pound: "lb",
    g: "g",
    grams: "g",
    ml: "ml",
    l: "l",
    liters: "l",
  };
  return map[u] || u;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
