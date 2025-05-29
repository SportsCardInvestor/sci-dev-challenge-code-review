import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { CardResponse } from '../api/api';

type CardProps = {
  card: CardResponse;
};

export default function Card({ card }: CardProps) {
  const {
    Name,
    Set,
    Number,
    Type,
    Cost,
    Power,
    HP,
    FrontArt,
  } = card;

  const frontArt = FrontArt || 'https://placehold.co/120x170/374151/FFFFFF?text=No+Image';

  return (
      <View style={styles.card} testID="card-item">
        <View style={styles.imageContainer}>
          {frontArt ? (
              <Image
                  testID="card-image"
                  source={{ uri: frontArt }}
                  style={styles.image}
                  resizeMode="cover"
                  onError={() => console.error(`Failed to load image: ${frontArt}`)}
              />
          ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.name} testID="card-name">
            {Name}
          </Text>
          <Text style={styles.setNumber}>
            {Set} #{Number}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Type:</Text>
              <Text style={styles.statValue}>{Type}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Cost:</Text>
              <Text style={styles.statValue}>{Cost}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Power:</Text>
              <Text style={styles.statValue}>{Power}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>HP:</Text>
              <Text style={styles.statValue}>{HP}</Text>
            </View>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 100,
    height: 140,
    borderRadius: 4,
  },
  imagePlaceholder: {
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  setNumber: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  statsContainer: {
    flex: 1,
  },
  stat: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    width: 50,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});