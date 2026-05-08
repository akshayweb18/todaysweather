import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const [layer, z, x, y] = slug;
  
  if (!layer || !z || !x || !y) {
    return new NextResponse('Invalid parameters', { status: 400 });
  }

  const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`OWM Tile Fetch Error: ${response.status} for ${url}`);
        return new NextResponse('Error fetching tile', { status: response.status });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error("Map Tile Proxy Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
