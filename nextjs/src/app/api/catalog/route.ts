// app/api/catalog/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://api.swu-db.com/catalog/hps');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Catalog API Error:', error); // Log the error for debugging
        return NextResponse.json({ error: 'Failed to fetch catalog data' }, { status: 500 });
    }
}
