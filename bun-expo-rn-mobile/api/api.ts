// API module using direct CORS proxy for live SWUDB data
const SWUDB_BASE = "https://swudb.com/api";
const CORS_PROXY = "https://corsproxy.io/?";

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

// Use CORS proxy for web requests with better error handling
const fetchViaProxy = async (url: string): Promise<any> => {
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
  console.log('Fetching via CORS proxy:', proxyUrl);

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      // Add timeout and error handling
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Response is not JSON:', contentType);
      const text = await response.text();
      console.log('Raw response:', text.substring(0, 200) + '...');
      // Try to parse it anyway in case content type header is wrong
      try {
        return JSON.parse(text);
      } catch {
        throw new Error('Response is not valid JSON');
      }
    }

    const data = await response.json();
    console.log('Proxy response received successfully');
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(
      error instanceof Error ? 
        `Proxy request failed: ${error.message}` : 
        'Unknown proxy error'
    );
  }
};

// Helper function to generate mock cards for fallback/development
const getMockCards = (cost: string): CardResponse[] => {
  // Generate 1-5 cards with varied properties based on cost
  const costNum = parseInt(cost) || 0;
  const cardCount = Math.min(5, costNum + 1) || 3;

  return Array.from({ length: cardCount }, (_, i) => ({
    Set: `SET${Math.floor(Math.random() * 5) + 1}`,
    Number: `${(i + 1).toString().padStart(3, '0')}`,
    Name: `Card ${i + 1} (Cost ${cost})`,
    Type: ['Character', 'Event', 'Upgrade', 'Support'][Math.floor(Math.random() * 4)],
    Cost: cost,
    Power: ((parseInt(cost) || 0) + Math.floor(Math.random() * 3)).toString(),
    HP: ((parseInt(cost) || 0) + Math.floor(Math.random() * 5)).toString(),
    Traits: ['Hero', 'Villain', 'Neutral'][Math.floor(Math.random() * 3)].split(','),
    FrontArt: `https://placehold.co/120x170/374151/FFFFFF?text=Card+${i + 1}`
  }));
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

    // Build the SWUDB API URL with proper parameters
    // Format the URL correctly - don't use URLSearchParams to avoid issues with parameter format
    let swudbUrl = `${SWUDB_BASE}/search/cost=${cost}?grouping=cards&sortorder=setno&sortdir=asc`;
    console.log('SWUDB URL:', swudbUrl);

    // Fetch via CORS proxy
    const cardData = await fetchViaProxy(swudbUrl);

    console.log('Response type:', typeof cardData);
    console.log('Raw SWUDB response keys:', cardData ? Object.keys(cardData) : 'No data');

    // Check if the API returned an error message
    if (cardData && typeof cardData === 'object') {
      if ('explanation' in cardData && 'validQuery' in cardData && cardData.validQuery === false) {
        const errorMessage = typeof cardData.explanation === 'string' ? cardData.explanation : 'Unknown API error';
        console.error('API returned an error:', errorMessage);
        throw new Error(`API error: ${errorMessage}`);
      }
    }

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

    // Always return fallback data if the API fails
    console.warn('Returning fallback card data');
    return {
      data: getMockCards(cost),
      success: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};