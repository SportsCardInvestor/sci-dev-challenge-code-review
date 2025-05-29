import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from "react-native";
import { fetchCatalog } from "../api/api";

type DropdownProps = {
  onSelect: (value: string) => void;
};

export default function Dropdown({ onSelect }: DropdownProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const result = await fetchCatalog();
        setOptions(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    void loadOptions();
  }, []);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
  };

  if (loading) {
    return (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading options...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
    );
  }

  return (
      <View style={styles.container} testID="dropdown-container">
        <Text style={styles.label}>Filter by HP:</Text>
        <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setModalVisible(true)}
            testID="hp-dropdown"
        >
          <Text style={styles.dropdownButtonText}>
            {selectedValue || "Select HP"}
          </Text>
        </TouchableOpacity>

        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <FlatList
                  data={["", ...options]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                      <TouchableOpacity
                          style={[styles.optionItem, selectedValue === item && styles.selectedOption]}
                          onPress={() => {
                            handleChange(item);
                            setModalVisible(false);
                          }}
                      >
                        <Text style={styles.optionText}>{item || "Clear selection"}</Text>
                      </TouchableOpacity>
                  )}
              />
            </View>
          </View>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1F2937",
    borderRadius: 8,
    margin: 8,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dropdownButton: {
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dropdownButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: "#3B82F6",
  },
  loadingText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
});