import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";

import { AddItemForm } from "../components/Inventory/AddItemForm";

export default function ModalScreen() {
  const router = useRouter();
  const { scanner, target } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AddItemForm
        onClose={() => router.back()}
        startWithScanner={scanner === "true"}
        defaultTarget={target === "shopping" ? "shopping" : "pantry"}
      />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
