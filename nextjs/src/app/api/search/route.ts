import {NextResponse} from 'next/server';

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const hp = searchParams.get('hp');
    try {
        // Fix the URL formatting - the query parameter should be properly formatted
        const res = await fetch(`https://api.swu-db.com/cards/search?q=hp=${hp}&pretty=true`);
        if (!res.ok) throw new Error('Failed to fetch cards');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Search API Error:', error); // Log the error for debugging
        return NextResponse.json({error: 'Failed to fetch card data'}, {status: 500});
    }
}
