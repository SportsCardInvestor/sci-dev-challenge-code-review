// api.ts
import axios from "axios";

const BASE_URL = "http://localhost:8010/proxy";

export class APIError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export interface CardResponse {
  Set: string;
  Number: string;
  Name: string;
  Type: string;
  Aspects?: string[];
  Traits?: string[];
  Arenas?: string[];
  Cost: string;
  Power: string;
  HP: string;
  FrontText?: string;
  DoubleSided?: boolean;
  Rarity?: string;
  Unique?: boolean;
  Artist?: string;
  VariantType?: string;
  MarketPrice?: string;
  FoilPrice?: string;
  FrontArt?: string;
}

export interface APIResponse<T> {
  data: T;
  status?: number;
  message?: string;
}

export const fetchCatalog = async (): Promise<APIResponse<string[]>> => {
  try {
    const response = await axios.get<APIResponse<string[]>>(
      `${BASE_URL}/catalog/hps`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new APIError(
        `Failed to fetch catalog data: ${error.message}`,
        error,
      );
    }
    throw new APIError("Failed to fetch catalog data");
  }
};

export const searchCards = async (
  hp: string,
): Promise<APIResponse<CardResponse[]>> => {
  try {
    const response = await axios.get<APIResponse<CardResponse[]>>(
      `${BASE_URL}/cards/search`,
      {
        params: {
          q: `h=${hp}`,
          pretty: true,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new APIError(`Failed to fetch card data: ${error.message}`, error);
    }
    throw new APIError("Failed to fetch card data");
  }
};
