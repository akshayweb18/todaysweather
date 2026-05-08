import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Using Nominatim (OpenStreetMap) for better state/city accuracy
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q,
        format: 'json',
        addressdetails: 1,
        limit: 10,
        'accept-language': 'en', // Force English results
        featuretype: 'city,state,country' // Focus on administrative areas
      },
      headers: {
        'User-Agent': 'WeatherApp_Geocoding/1.0'
      }
    });

    const suggestions = res.data.map((item: any) => {
      const address = item.address;
      const name = item.name || address.city || address.town || address.village || address.state;
      const state = address.state || address.region;
      const country = address.country;
      const countryCode = address.country_code?.toUpperCase();

      return {
        name,
        country: countryCode,
        countryFull: country,
        state: state || '',
        fullName: `${name}${state ? `, ${state}` : ''}, ${countryCode}`,
        lat: item.lat,
        lon: item.lon
      };
    });

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
    console.error("[Geo API Error]", error.message);
    return NextResponse.json({ success: false, error: "Geocoding Failed." }, { status: 500 });
  }
}
