import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";
import React from "react";

import { AddItemForm } from "../../../components/Inventory/AddItemForm";

// Mock dependencies
jest.mock("expo-camera", () => ({
  CameraView: () => null,
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

jest.mock("lucide-react-native", () => {
  return new Proxy(
    {},
    {
      get: (target, name) => {
        if (name === "__esModule") return true;
        return () => null;
      },
    },
  );
});

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success" },
  ImpactFeedbackStyle: { Medium: "medium" },
}));

jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props: any) => {
      return null;
    },
  };
});

jest.mock("../../../hooks/usePantry", () => ({
  useAddPantryItem: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("../../../hooks/useShoppingList", () => ({
  useAddShoppingItem: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("../../../services/openFoodFacts", () => ({
  fetchProductByBarcode: jest.fn(),
}));

const queryClient = new QueryClient();

describe("AddItemForm Integration", () => {
  it("renders with SmartDateChips for pantry target", () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AddItemForm onClose={jest.fn()} defaultTarget="pantry" />
      </QueryClientProvider>,
    );

    // Check for common chips labels
    expect(getByText("+1 Week")).toBeTruthy();
    expect(getByText("+1 Month")).toBeTruthy();
  });
});
