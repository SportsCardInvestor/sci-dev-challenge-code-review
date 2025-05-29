import "@testing-library/jest-native/extend-expect";
import { View } from "react-native";

// Mock the Picker component
jest.mock("@react-native-picker/picker", () => {
  const MockPicker = ({ children, selectedValue, onValueChange, testID }) => {
    const props = { selectedValue }; // Explicitly expose selectedValue in props

    return (
      <View testID={testID || "picker"} props={props}>
        <select
          value={selectedValue}
          onChange={(e) => {
            onValueChange(e.target.value);
          }}
        >
          {children}
        </select>
      </View>
    );
  };

  const MockItem = ({ label, value }) => <option value={value}>{label}</option>;

  return {
    Picker: MockPicker,
    Item: MockItem,
  };
});

// Mock Reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};
