import axios from "axios";

import { fetchCatalog, searchCards } from "../api";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchCatalog", () => {
    it("successfully fetches catalog data", async () => {
      const mockData = ["HP1", "HP2", "HP3"];
      mockedAxios.get.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchCatalog();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/proxy/catalog/hps",
      );
      expect(result.data).toEqual(mockData);
    });

    it("handles network errors", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchCatalog()).rejects.toThrow(
        "Failed to fetch catalog data",
      );
    });
  });

  describe("searchCards", () => {
    const mockCards = [
      { id: 1, name: "Card 1", Set: "Set1" },
      { id: 2, name: "Card 2", Set: "Set1" },
    ];

    it("successfully searches cards with HP parameter", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { data: mockCards } });

      const result = await searchCards("HP1");
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/proxy/cards/search",
        {
          params: {
            q: "h=HP1",
            pretty: true,
          },
        },
      );
      expect(result.data).toEqual(mockCards);
    });

    it("handles network errors", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(searchCards("HP1")).rejects.toThrow(
        "Failed to fetch card data",
      );
    });
  });
});
