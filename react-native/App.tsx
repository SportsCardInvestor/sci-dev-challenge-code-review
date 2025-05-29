import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Platform } from "react-native";

import CardList from "./src/components/CardList";
import Dropdown from "./src/components/Dropdown";
import ParallaxScrollView from "./src/components/ParallaxScrollView";

export default function App() {
  const [selectedHP, setSelectedHP] = useState<string>("");

  // Simple header image component could be added here
  const HeaderImage = () => null;

  const content = (
    <>
      <Dropdown onSelect={setSelectedHP} />
      <CardList hp={selectedHP} />
    </>
  );

  // Use ParallaxScrollView only on mobile platforms
  if (Platform.OS !== "web") {
    return (
      <SafeAreaView style={styles.container}>
        <ParallaxScrollView
          headerImage={<HeaderImage />}
          headerBackgroundColor={{ dark: "#1F2937", light: "#F3F4F6" }}
        >
          {content}
        </ParallaxScrollView>
      </SafeAreaView>
    );
  }

  // Simpler layout for web
  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
});
