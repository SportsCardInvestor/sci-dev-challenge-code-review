import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { fetchCatalog } from '../../api/api';
import CardList from '../../components/CardList';

export default function CardsScreen() {
  const [costOptions, setCostOptions] = useState<string[]>([]);
  const [selectedCost, setSelectedCost] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCostOptions = async () => {
      try {
        setLoading(true);
        const response = await fetchCatalog();

        // Debug logging
        console.log('Cost Catalog Response:', response);
        console.log('Cost Data:', response.data);
        console.log('Is Array:', Array.isArray(response.data));

        // Ensure we have an array
        const costArray = Array.isArray(response.data) ? response.data : [];
        setCostOptions(costArray);

        if (costArray.length > 0) {
          setSelectedCost(costArray[2]); // Default to cost 2
        }
      } catch (err) {
        console.error('Failed to load cost options:', err);
        setError('Failed to load cost options. Please try again later.');
        // Set empty array as fallback
        setCostOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadCostOptions();
  }, []);

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Card Explorer</Text>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by Cost:</Text>
          <View style={styles.pickerContainer}>
            {loading ? (
                <Text style={styles.loadingText}>Loading cost options...</Text>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <Picker
                    selectedValue={selectedCost}
                    onValueChange={(value) => setSelectedCost(value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    testID="cost-picker"
                >
                  <Picker.Item label="Select Cost" value="" />
                  {costOptions.map((cost) => (
                      <Picker.Item key={cost} label={cost} value={cost} />
                  ))}
                </Picker>
            )}
          </View>
        </View>

        <CardList cost={selectedCost} />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#1F2937',
    marginHorizontal: 8,
    marginTop: 16,
    borderRadius: 8,
  },
  filterLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  picker: {
    height: 50,
    color: '#FFFFFF',
  },
  pickerItem: {
    color: '#FFFFFF',
  },
  loadingText: {
    color: '#9CA3AF',
    padding: 12,
  },
  errorText: {
    color: '#EF4444',
    padding: 12,
  },
});