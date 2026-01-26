import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Download,
  Link as LinkIcon,
  Plus,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAddRecipe } from "../../hooks/useRecipes";
import { RecipeStackParamList } from "../../types/navigation";
import { extractRecipeFromUrl } from "../../utils/recipeScraper";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { source_url } =
    useLocalSearchParams<RecipeStackParamList["recipes/create"]>();
  const addRecipeMutation = useAddRecipe();

  const [importUrl, setImportUrl] = useState(source_url || "");
  const [isImporting, setIsImporting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [tags, setTags] = useState("");

  // Ingredients State
  const [ingredients, setIngredients] = useState<
    { id: string; name: string; quantity: string; unit: string }[]
  >([{ id: "1", name: "", quantity: "", unit: "items" }]);

  // Instructions State
  const [instructions, setInstructions] = useState<
    { id: string; text: string }[]
  >([{ id: "1", text: "" }]);

  const addIngredientRow = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", quantity: "", unit: "items" },
    ]);
  };

  const removeIngredientRow = (id: string) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const updateIngredient = (
    id: string,
    field: "name" | "quantity" | "unit",
    value: string,
  ) => {
    setIngredients(
      ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  };

  const addInstructionStep = () => {
    setInstructions([...instructions, { id: Date.now().toString(), text: "" }]);
  };

  const removeInstructionStep = (id: string) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((i) => i.id !== id));
  };

  const updateInstruction = (id: string, text: string) => {
    setInstructions(
      instructions.map((i) => (i.id === id ? { ...i, text } : i)),
    );
  };

  // Author State
  const [author, setAuthor] = useState("");
  const [sourceUrlData, setSourceUrlData] = useState("");

  const handleImport = async () => {
    if (!importUrl.trim()) return;

    setIsImporting(true);
    const recipe = await extractRecipeFromUrl(importUrl.trim());
    setIsImporting(false);

    if (!recipe) {
      Alert.alert(
        "Import Failed",
        "Could not extract recipe details. Please try another URL or enter manually.",
      );
      return;
    }

    setName(recipe.name);
    setDescription(recipe.description || "");
    if (recipe.prep_time) setPrepTime(recipe.prep_time.toString());
    if (recipe.cook_time) setCookTime(recipe.cook_time.toString());
    if (recipe.servings) setServings(recipe.servings.toString());
    if (recipe.author) setAuthor(recipe.author);
    setSourceUrlData(recipe.source_url || importUrl.trim());

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      setIngredients(
        recipe.ingredients.map((ing, idx) => ({
          id: Date.now().toString() + "ing" + idx,
          name: ing.name,
          quantity: ing.quantity.toString(),
          unit: ing.unit,
        })),
      );
    }

    if (recipe.instructions && recipe.instructions.length > 0) {
      setInstructions(
        recipe.instructions.map((inst, idx) => ({
          id: Date.now().toString() + "inst" + idx,
          text: inst,
        })),
      );
    }

    Alert.alert("Recipe Imported", "Refine the details and save.");
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter a recipe name.");
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim() !== "");
    if (validIngredients.length === 0) {
      Alert.alert("Missing Ingredients", "Please add at least one ingredient.");
      return;
    }

    const validInstructions = instructions.filter((i) => i.text.trim() !== "");
    if (validInstructions.length === 0) {
      Alert.alert(
        "Missing Instructions",
        "Please add at least one instruction step.",
      );
      return;
    }

    const recipeData = {
      name: name.trim(),
      description: description.trim(),
      prep_time: parseInt(prepTime) || 0,
      cook_time: parseInt(cookTime) || 0,
      servings: parseInt(servings) || 2,
      ingredients: validIngredients.map((i) => ({
        name: i.name.trim(),
        quantity: parseFloat(i.quantity) || 0,
        unit: i.unit.trim() || "items",
      })),
      instructions: validInstructions.map((i) => i.text.trim()),
      tags: tags
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t !== ""),
      author: author.trim(),
      source_url: sourceUrlData || undefined,
    };

    addRecipeMutation.mutate(recipeData, {
      onSuccess: () => {
        Alert.alert("Success", "Recipe created!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      },
      onError: (error: Error) => {
        Alert.alert("Error", error.message);
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#f3f4f6",
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <ChevronLeft size={24} color="#111827" />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 8 }}>
          Create Recipe
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Import Section */}
        <View
          style={{
            backgroundColor: "#f0fdf4",
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#dcfce7",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <LinkIcon size={16} color="#15803d" />
            <Text
              style={{ marginLeft: 8, color: "#15803d", fontWeight: "bold" }}
            >
              Import from Web
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder="Paste recipe URL..."
              value={importUrl}
              onChangeText={setImportUrl}
              autoCapitalize="none"
              style={{
                flex: 1,
                backgroundColor: "white",
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#dcfce7",
                marginRight: 8,
              }}
            />
            <Pressable
              onPress={handleImport}
              disabled={isImporting || !importUrl.trim()}
              style={{
                backgroundColor: "#10b981",
                paddingHorizontal: 16,
                justifyContent: "center",
                borderRadius: 8,
                opacity: isImporting || !importUrl.trim() ? 0.7 : 1,
              }}
            >
              {isImporting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Download size={20} color="white" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Basic Info */}
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Recipe Details
        </Text>

        <TextInput
          placeholder="Author / Source"
          value={author}
          onChangeText={setAuthor}
          style={{
            backgroundColor: "#f9fafb",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Recipe Name (e.g. Avocado Toast)"
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: "#f9fafb",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{
            backgroundColor: "#f9fafb",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            fontSize: 16,
            textAlignVertical: "top",
          }}
        />

        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              Prep Time (mins)
            </Text>
            <TextInput
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
              style={{
                backgroundColor: "#f9fafb",
                padding: 12,
                borderRadius: 12,
              }}
            />
          </View>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              Cook Time (mins)
            </Text>
            <TextInput
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="numeric"
              style={{
                backgroundColor: "#f9fafb",
                padding: 12,
                borderRadius: 12,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              Servings
            </Text>
            <TextInput
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
              placeholder="2"
              style={{
                backgroundColor: "#f9fafb",
                padding: 12,
                borderRadius: 12,
              }}
            />
          </View>
        </View>

        <TextInput
          placeholder="Tags (e.g. Keto, Breakfast, Italian)"
          value={tags}
          onChangeText={setTags}
          style={{
            backgroundColor: "#f9fafb",
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 16,
          }}
        />

        {/* Ingredients */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Ingredients</Text>
          <Pressable
            onPress={addIngredientRow}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Plus size={16} color="#10b981" />
            <Text
              style={{ color: "#10b981", fontWeight: "bold", marginLeft: 4 }}
            >
              Add Item
            </Text>
          </Pressable>
        </View>

        {ingredients.map((item, index) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 2, marginRight: 8 }}>
              <TextInput
                placeholder="Ingredient"
                value={item.name}
                onChangeText={(text) => updateIngredient(item.id, "name", text)}
                style={{
                  backgroundColor: "#f9fafb",
                  padding: 12,
                  borderRadius: 8,
                }}
              />
            </View>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextInput
                placeholder="Qty"
                value={item.quantity}
                onChangeText={(text) =>
                  updateIngredient(item.id, "quantity", text)
                }
                keyboardType="numeric"
                style={{
                  backgroundColor: "#f9fafb",
                  padding: 12,
                  borderRadius: 8,
                }}
              />
            </View>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextInput
                placeholder="Unit"
                value={item.unit}
                onChangeText={(text) => updateIngredient(item.id, "unit", text)}
                style={{
                  backgroundColor: "#f9fafb",
                  padding: 12,
                  borderRadius: 8,
                }}
              />
            </View>
            <Pressable
              onPress={() => removeIngredientRow(item.id)}
              style={{ padding: 8 }}
            >
              <Trash2 size={20} color="#ef4444" />
            </Pressable>
          </View>
        ))}

        {/* Instructions */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Instructions</Text>
          <Pressable
            onPress={addInstructionStep}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Plus size={16} color="#10b981" />
            <Text
              style={{ color: "#10b981", fontWeight: "bold", marginLeft: 4 }}
            >
              Add Step
            </Text>
          </Pressable>
        </View>

        {instructions.map((item, index) => (
          <View
            key={item.id}
            style={{ flexDirection: "row", marginBottom: 12 }}
          >
            <View style={{ width: 30, paddingTop: 12 }}>
              <Text style={{ fontWeight: "bold", color: "#6b7280" }}>
                {index + 1}.
              </Text>
            </View>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextInput
                placeholder="Instruction step..."
                value={item.text}
                onChangeText={(text) => updateInstruction(item.id, text)}
                multiline
                style={{
                  backgroundColor: "#f9fafb",
                  padding: 12,
                  borderRadius: 8,
                  minHeight: 60,
                  textAlignVertical: "top",
                }}
              />
            </View>
            <Pressable
              onPress={() => removeInstructionStep(item.id)}
              style={{ padding: 8, paddingTop: 12 }}
            >
              <Trash2 size={20} color="#ef4444" />
            </Pressable>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 24,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
        }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={addRecipeMutation.isPending}
          style={{
            backgroundColor: "#10b981",
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {addRecipeMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Save Recipe
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
