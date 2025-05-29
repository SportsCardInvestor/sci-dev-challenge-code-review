import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import * as api from "../../api/api";
import CardList from "../CardList";

jest.mock("../../api/api");

describe("CardList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful API response
    jest.spyOn(api, "searchCards").mockResolvedValue({
      data: [
        {
          Set: "Set1",
          Number: "001",
          Name: "Card 2",
          Type: "Unit",
          Cost: "1",
          HP: "3",
          Power: "3",
        },
        {
          Set: "Set2",
          Number: "002",
          Name: "Card 2",
          Type: "Unit",
          Cost: "2",
          HP: "4",
          Power: "5",
        },
      ],
    });
  });

  it("renders cards and allows sorting", async () => {
    render(<CardList hp="HP1" />);

    // Wait for loading state
    expect(screen.getByText(/Loading cards.../i)).toBeTruthy();

    // Wait for cards to load
    await waitFor(() => {
      expect(screen.getByText("Card 1")).toBeTruthy();
      expect(screen.getByText("Card 2")).toBeTruthy();
    });
  });

  it("displays loading and error states", async () => {
    jest
      .spyOn(api, "searchCards")
      .mockRejectedValue(new Error("Error: An error occurred"));
    render(<CardList hp="HP1" />);

    expect(screen.getByText(/Loading cards.../i)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeTruthy();
    });
  });
});
