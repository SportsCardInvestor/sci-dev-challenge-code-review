import { GET } from './route';

describe('/api/search GET', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should return cards matching HP', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                total_cards: 1,
                data: [
                    {
                        Set: 'TWI',
                        Number: '096',
                        name: 'Aayla Secura',

                    },
                ],
            }),
        });

        const mockRequest = {
            url: 'https://example.com/api/search?hp=5',
        } as Request;

        const response = await GET(mockRequest);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.total_cards).toBe(1);
        expect(result.data[0].Name).toBe('Aayla Secura');
    });

    it('should return 500 when fetch fails', async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch cards'));

        const mockRequest = {
            url: 'https://example.com/api/search?hp=5',
        } as Request;

        const response = await GET(mockRequest);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toBe('Failed to fetch card data');
    });
});
