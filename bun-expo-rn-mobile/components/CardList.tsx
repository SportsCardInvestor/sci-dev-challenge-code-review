import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { CardResponse, searchCards } from '../api/api';
import Card from './Card';

type CardListProps = {
  hp: string;
};

export default function CardList({ hp }: CardListProps) {
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'Name' | 'Set' | 'Cost' | 'Power'>('Name');

  useEffect(() => {
    if (!hp) {
      setCards([]);
      return;
    }

    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchCards(hp);

        // Debug logging
        console.log('Card Search Response:', response);
        console.log('Card Data:', response.data);
        console.log('Is Array:', Array.isArray(response.data));

        // Ensure we have an array
        const cardArray = Array.isArray(response.data) ? response.data : [];
        setCards(cardArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
        setCards([]); // Ensure cards is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [hp]);

  // Ensure cards is always an array before sorting
  const safeCards = Array.isArray(cards) ? cards : [];
  const sortedCards = [...safeCards].sort((a, b) => {
    if (sortKey === 'Name' || sortKey === 'Set') {
      return (a[sortKey] || '').localeCompare(b[sortKey] || '');
    }
    return parseInt(a[sortKey] || '0') - parseInt(b[sortKey] || '0');
  });

  if (loading) {
    return (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading cards...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
    );
  }

  if (sortedCards.length === 0 && hp) {
    return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No cards found for HP: {hp}</Text>
        </View>
    );
  }

  if (sortedCards.length === 0) {
    return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Select HP to see cards</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.sortButtons}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={[styles.sortButton, sortKey === 'Name' && styles.activeButton]}
                onPress={() => setSortKey('Name')}
                testID="sort-by-name"
            >
              <Text style={styles.buttonText}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sortButton, sortKey === 'Set' && styles.activeButton]}
                onPress={() => setSortKey('Set')}
                testID="sort-by-set"
            >
              <Text style={styles.buttonText}>Set</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sortButton, sortKey === 'Cost' && styles.activeButton]}
                onPress={() => setSortKey('Cost')}
                testID="sort-by-cost"
            >
              <Text style={styles.buttonText}>Cost</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sortButton, sortKey === 'Power' && styles.activeButton]}
                onPress={() => setSortKey('Power')}
                testID="sort-by-power"
            >
              <Text style={styles.buttonText}>Power</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
            data={sortedCards}
            renderItem={({ item }) => <Card card={item} />}
            keyExtractor={(item) => `${item.Set}-${item.Number}`}
            testID="card-list"
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  sortButtons: {
    padding: 16,
    backgroundColor: '#1F2937',
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  sortLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    backgroundColor: '#374151',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});