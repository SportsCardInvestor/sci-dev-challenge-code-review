import { GET } from './route';

describe('/api/catalog GET', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should return a list of HP options', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                object: 'catalog',
                uri: 'https://api.swu-db.com/catalog/HPS',
                total_values: 20,
                data: ['0', '+1', '+2', '-3'],
            }),
        });

        const response = await GET();
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.object).toBe('catalogue');
        expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return 500 when fetch fails', async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch data'));

        const response = await GET();
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toBe('Failed to fetch catalog data');
    });
});
