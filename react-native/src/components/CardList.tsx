// CardList.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Card from "./Card";
import { searchCards, CardResponse } from "../api/api";

type CardData = {
  set: string;
  number: string;
  name: string;
  type: string;
  aspects: string[];
  traits: string[];
  arenas: string[];
  cost: number;
  power: number;
  hp: number;
  fronttext: string;
  doublesided: boolean;
  rarity: string;
  unique: boolean;
  artist: string;
  varianttype: string;
  marketprice: string;
  foilprice: string;
  frontArt: string;
  id: string;
};

type CardListProps = {
  hp?: string;
};

const transformCardResponse = (card: CardResponse): CardData => ({
  set: card.Set,
  number: card.Number,
  name: card.Name,
  type: card.Type,
  aspects: card.Aspects || [],
  traits: card.Traits || [],
  arenas: card.Arenas || [],
  cost: parseInt(card.Cost || "0", 10),
  power: parseInt(card.Power || "0", 10),
  hp: parseInt(card.HP || "0", 10),
  fronttext: card.FrontText || "",
  doublesided: card.DoubleSided || false,
  rarity: card.Rarity || "",
  unique: card.Unique || false,
  artist: card.Artist || "",
  varianttype: card.VariantType || "",
  marketprice: card.MarketPrice || "",
  foilprice: card.FoilPrice || "",
  frontArt: card.FrontArt || "",
  id: `${card.Set || "unknown-set"}-${card.Number || "unknown-number"}`,
});

export default function CardList({ hp = "" }: CardListProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof CardData>("name");

  useEffect(() => {
    const fetchCardData = async () => {
      if (!hp) {
        setCards([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await searchCards(hp);
        const formattedCards = result.data.map(transformCardResponse);

        setCards(
          formattedCards.sort((a, b) =>
            a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0,
          ),
        );
      } catch (err) {
        //setError("Failed to load cards");
        setError(err instanceof Error ? err.message : "Failed to load cards");
      } finally {
        setLoading(false);
      }
    };

    void fetchCardData();
  }, [hp, sortKey]);

  const sortCards = (key: keyof CardData) => {
    setSortKey(key);
    setCards(
      [...cards].sort((a, b) =>
        a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0,
      ),
    );
  };

  const renderSortButton = (
    label: string,
    key: keyof CardData,
    color: string,
  ) => (
    <TouchableOpacity
      style={[styles.sortButton, { backgroundColor: color }]}
      onPress={() => {
        sortCards(key);
      }}
      accessible
      testID={`sort-by-${key}`}
    >
      <Text style={styles.sortButtonText}>Sort by {label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading cards...</Text>
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

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>No cards found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sortButtons}>
        {renderSortButton("Name", "name", "#3B82F6")}
        {renderSortButton("Set", "set", "#10B981")}
        {renderSortButton("Cost", "cost", "#8B5CF6")}
        {renderSortButton("Power", "power", "#EF4444")}
      </View>
      <FlatList
        data={cards}
        renderItem={({ item }) => <Card {...item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        testID="card-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111827",
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
  },
  sortButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  messageText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    padding: 16,
  },
  errorText: {
    textAlign: "center",
    color: "#EF4444",
    fontSize: 16,
    padding: 16,
  },
});
