import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const card_meta = "this is some meta data"; // Deliberately add unused variable

type CardProps = {
  name: string;
  set: string;
  cost: number;
  power: number;
  hp: string;
  type: string;
  traits: string[];
  rarity: string;
  frontArt: string;
};

export default function Card({
  name,
  set,
  cost,
  power,
  hp,
  type,
  traits,
  rarity,
  frontArt,
}: CardProps) {
  return (
    <View style={styles.card} testID="card">
      <View style={styles.imageContainer}>
        <Image
          testID="card-image"
          source={{ uri: frontArt }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.detail}>Set: {set}</Text>
        <Text style={styles.detail}>Type: {type}</Text>
        <Text style={styles.detail}>Traits: {traits?.join(", ")}</Text>
        <Text style={styles.detail}>Cost: {cost}</Text>
        <Text style={styles.detail}>Power: {power}</Text>
        <Text style={styles.detail}>HP: {hp}</Text>
        <Text style={styles.detail}>Rarity: {rarity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 8,
    margin: 8,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 2,
  },
});
