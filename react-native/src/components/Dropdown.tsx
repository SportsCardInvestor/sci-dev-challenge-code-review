// Dropdown.tsx
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { fetchCatalog } from "../api/api";

type DropdownProps = {
  onSelect: (selectedValue: string) => void;
};

export default function Dropdown({ onSelect }: DropdownProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const result = await fetchCatalog();
        setOptions(result.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load options";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void loadOptions();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading options...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Picker
        testID="picker"
        selectedValue={selectedValue}
        onValueChange={(itemValue: string) => {
          setSelectedValue(itemValue);
          onSelect(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select HP" value="" />
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 8,
    backgroundColor: "#374151",
  },
  picker: {
    color: "#FFFFFF",
    height: 50,
  },
  loadingText: {
    textAlign: "center",
    color: "#FFFFFF",
    padding: 10,
  },
  errorText: {
    textAlign: "center",
    color: "#EF4444",
    padding: 10,
  },
});
