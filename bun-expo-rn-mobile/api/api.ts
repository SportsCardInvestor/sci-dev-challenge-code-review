// API module using direct CORS proxy for live SWUDB data
const SWUDB_BASE = "https://swudb.com/api";
const CORS_PROXY = "https://api.allorigins.win/get?url=";

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

// API response interface
export interface APIResponse<T> {
  data: T;
  success?: boolean;
  error?: string;
  status?: number;
  message?: string;
}

// Card response interface
export interface CardResponse {
  Set: string;
  SetName?: string;
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

// Always use CORS proxy for web requests
const fetchViaProxy = async (url: string): Promise<any> => {
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
  console.log('Fetching via CORS proxy:', proxyUrl);

  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
  }

  const proxyData = await response.json();
  console.log('Proxy response:', proxyData);

  // Parse the contents from the proxy response
  return JSON.parse(proxyData.contents);
};

// Generate cost catalog (0-15 should cover most cards)
export const fetchCatalog = async (): Promise<APIResponse<string[]>> => {
  console.log('Generating cost catalog...');

  // Generate cost options 0-15
  const costOptions = Array.from({ length: 16 }, (_, i) => i.toString());

  console.log('Generated cost options:', costOptions);

  return {
    data: costOptions,
    success: true
  };
};

// Search cards by cost using live SWUDB data
export const searchCards = async (
    cost: string,
): Promise<APIResponse<CardResponse[]>> => {
  try {
    console.log('Searching for cards with cost:', cost);

    // Build the SWUDB API URL
    const swudbUrl = `${SWUDB_BASE}/search/cost=${cost}?grouping=cards&sortorder=setno&sortdir=asc`;
    console.log('SWUDB URL:', swudbUrl);

    // Fetch via CORS proxy
    const cardData = await fetchViaProxy(swudbUrl);

    console.log('Raw SWUDB response:', cardData);
    console.log('Response type:', typeof cardData);

    // Handle the SWUDB response format
    let processedCards: CardResponse[] = [];

    if (Array.isArray(cardData)) {
      processedCards = cardData;
    } else if (cardData && Array.isArray(cardData.data)) {
      processedCards = cardData.data;
    } else if (cardData && Array.isArray(cardData.results)) {
      processedCards = cardData.results;
    } else if (cardData && Array.isArray(cardData.cards)) {
      processedCards = cardData.cards;
    } else if (cardData && typeof cardData === 'object') {
      // Try to find any array in the response
      for (const [key, value] of Object.entries(cardData)) {
        if (Array.isArray(value) && value.length > 0) {
          console.log(`Found cards array in key: ${key}`);
          processedCards = value as CardResponse[];
          break;
        }
      }
    }

    console.log('Processed cards:', processedCards.length, 'cards found');
    console.log('Sample card:', processedCards[0]);

    return {
      data: processedCards,
      success: true
    };

  } catch (error) {
    console.error(`Failed to search cards with cost ${cost}:`, error);

    throw new APIError(
        `Failed to fetch cards with cost ${cost}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
    );
  }
};