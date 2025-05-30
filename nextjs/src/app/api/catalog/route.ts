// app/api/catalog/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://api.swu-db.com/catalog/hps');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        // Transform the response to match expected format
        const transformedData = {
            ...data,
            object: 'catalogue' // Change object from 'catalog' to 'catalogue'
        };
        return NextResponse.json(transformedData);
    } catch (error) {
        console.error('Catalog API Error:', error); // Log the error for debugging
        return NextResponse.json({ error: 'Failed to fetch catalog data' }, { status: 500 });
    }
}
