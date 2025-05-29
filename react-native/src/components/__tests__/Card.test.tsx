import { render, screen } from "@testing-library/react-native";
import React from "react";

import Card from "../Card";

const mockProps = {
  name: "Test Card",
  set: "Base Set",
  cost: 3,
  power: 5,
  hp: "HP1",
  type: "Character",
  traits: ["Trait1", "Trait2"],
  rarity: "Rare",
  frontArt: "http://example.com/image.jpg",
};

describe("Card Component", () => {
  it("renders all card information correctly", () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText(mockProps.name)).toBeTruthy();
    expect(screen.getByText(`Set: ${mockProps.set}`)).toBeTruthy();
    expect(screen.getByText(`Type: ${mockProps.type}`)).toBeTruthy();
    expect(
      screen.getByText(`Traits: ${mockProps.traits.join(", ")}`),
    ).toBeTruthy();
    expect(screen.getByText(`Cost: ${mockProps.cost}`)).toBeTruthy();
    expect(screen.getByText(`Power: ${mockProps.power}`)).toBeTruthy();
    expect(screen.getByText(`HP: ${mockProps.hp}`)).toBeTruthy();
    expect(screen.getByText(`Rarity: ${mockProps.rarity}`)).toBeTruthy();
  });

  it("renders image with correct source", () => {
    render(<Card {...mockProps} />);
    const image = screen.getByTestId("card-image");
    expect(image.props.source.uri).toBe(mockProps.frontArt);
  });

  it("handles missing traits gracefully", () => {
    const propsWithoutTraits = { ...mockProps, traits: [] };
    render(<Card {...propsWithoutTraits} />);
    expect(screen.getByText("Traits: ")).toBeTruthy();
  });
});
