import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const res = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: { q, limit: 10, appid: API_KEY }
    });

    const suggestions = res.data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      fullName: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`
    }));

    // Filter duplicates by fullName
    const uniqueSuggestions = suggestions.filter((v: any, i: number, a: any[]) => 
      a.findIndex(t => t.fullName === v.fullName) === i
    );

    return NextResponse.json({ success: true, data: uniqueSuggestions }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31536000'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Geocoding Failed." }, { status: 500 });
  }
}
