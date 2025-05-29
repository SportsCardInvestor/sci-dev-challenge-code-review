// API module for fetching card data from SWU-DB
const BASE_URL = "https://api.swu-db.com";
const CORS_PROXY = "https://api.allorigins.win/get?url=";

// Check if we're running in a browser environment that might need CORS proxy
const needsCorsProxy = typeof window !== 'undefined' &&
    window.location?.hostname === 'localhost';

// Error class for API-specific errors
export class APIError extends Error {
  constructor(
      message: string,
      public originalError?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

// API response interface - SWU-DB returns arrays directly
export interface APIResponse<T> {
  data: T;
  success?: boolean;
  error?: string;
  status?: number;
  message?: string;
}

// Card response interface based on SWU-DB API
export interface CardResponse {
  Set: string;
  SetName: string;
  Number: string;
  Name: string;
  Subtitle?: string;
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
  [key: string]: string | string[] | boolean | undefined;
}

// Helper function to make requests with optional CORS proxy
const fetchWithCorsHandling = async (url: string): Promise<Response> => {
  try {
    // First try direct request
    const response = await fetch(url);
    if (response.ok) {
      return response;
    }
    throw new Error(`Direct request failed: ${response.status}`);
  } catch (error) {
    if (needsCorsProxy) {
      console.log('Direct request failed, trying with CORS proxy...');
      // Try with CORS proxy
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
      const proxyResponse = await fetch(proxyUrl);

      if (!proxyResponse.ok) {
        throw new Error(`Proxy request failed: ${proxyResponse.status}`);
      }

      const proxyData = await proxyResponse.json();

      // allorigins.win wraps the response in a 'contents' field
      return {
        ok: true,
        json: async () => JSON.parse(proxyData.contents),
        text: async () => proxyData.contents,
      } as Response;
    }
    throw error;
  }
};

// Fetch HP options for filtering
export const fetchCatalog = async (): Promise<APIResponse<string[]>> => {
  try {
    const url = `${BASE_URL}/catalog/hps`;
    console.log('Fetching HP catalog from:', url);

    const response = await fetchWithCorsHandling(url);
    const hpArray = await response.json();

    console.log('Raw HP response:', hpArray);

    // Handle different response formats
    let processedHPs: string[];

    if (Array.isArray(hpArray)) {
      processedHPs = hpArray;
    } else if (hpArray && Array.isArray(hpArray.data)) {
      processedHPs = hpArray.data;
    } else if (hpArray && typeof hpArray === 'object') {
      // If it's an object, try to extract array values
      processedHPs = Object.values(hpArray).filter(val =>
          typeof val === 'string' || typeof val === 'number'
      ).map(String);
    } else {
      throw new Error('Unexpected response format');
    }

    console.log('Processed HPs:', processedHPs);

    return {
      data: processedHPs,
      success: true
    };
  } catch (error) {
    console.error('Failed to fetch HP catalog:', error);

    // Provide fallback HP options based on common Star Wars Unlimited HP values
    const fallbackHPs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    console.log('Using fallback HPs:', fallbackHPs);

    return {
      data: fallbackHPs,
      success: true,
      error: `Using fallback data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Search cards by HP using the correct query format
export const searchCards = async (
    hp: string,
): Promise<APIResponse<CardResponse[]>> => {
  try {
    const url = `${BASE_URL}/cards/search?q=h:${hp}&format=json`;
    console.log('Searching cards with HP:', hp, 'URL:', url);

    const response = await fetchWithCorsHandling(url);
    const cardData = await response.json();

    console.log('Raw card response:', cardData);

    // Handle different response formats
    let processedCards: CardResponse[];

    if (Array.isArray(cardData)) {
      processedCards = cardData;
    } else if (cardData && Array.isArray(cardData.data)) {
      processedCards = cardData.data;
    } else if (cardData && Array.isArray(cardData.results)) {
      processedCards = cardData.results;
    } else {
      // If no valid array found, return empty array
      console.warn('No valid card array found in response');
      processedCards = [];
    }

    console.log('Processed cards:', processedCards.length, 'cards found');

    return {
      data: processedCards,
      success: true
    };
  } catch (error) {
    console.error(`Failed to search cards with HP ${hp}:`, error);

    // Provide mock cards for development
    const mockCards: CardResponse[] = [
      {
        Set: "SOR",
        SetName: "Spark of Rebellion",
        Number: "001",
        Name: `Mock Card HP ${hp}`,
        Type: "Unit",
        Cost: "3",
        Power: "2",
        HP: hp,
        FrontArt: `https://placehold.co/120x170/4f46e5/ffffff?text=HP+${hp}+Card`,
        Rarity: "Common"
      },
      {
        Set: "SOR",
        SetName: "Spark of Rebellion",
        Number: "002",
        Name: `Another Mock Card HP ${hp}`,
        Type: "Event",
        Cost: "1",
        Power: "0",
        HP: hp,
        FrontArt: `https://placehold.co/120x170/dc2626/ffffff?text=Event+HP+${hp}`,
        Rarity: "Uncommon"
      }
    ];

    console.log('Using mock cards:', mockCards.length);

    return {
      data: mockCards,
      success: true,
      error: `Using mock data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};