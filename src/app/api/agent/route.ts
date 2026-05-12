import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const runtime = 'edge';

// 🚀 Tactical Fetch with Timeout Watchdog
const fetchWithTimeout = async (url: string, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

// 🚀 Ultra-High-Speed In-Memory Cache (Global Scope)
const globalCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');

    let lat: number, lon: number, current: any;

    console.log(`[API Agent] Requesting weather for: City=${city}, Lat=${latParam}, Lon=${lonParam}`);

    if (latParam && lonParam) {
      // Round coordinates to 2 decimal places (~1.1km precision) for massive cache hit improvement
      lat = Math.round(parseFloat(latParam) * 100) / 100;
      lon = Math.round(parseFloat(lonParam) * 100) / 100;

      const cacheKey = `weather-${lat}-${lon}`;
      const cached = globalCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`[API Agent] Cache Hit for ${cacheKey}`);
        return NextResponse.json({ success: true, data: cached.data }, {
          headers: { 'Cache-Control': 'public, s-maxage=3600' }
        });
      }


      const [currentRes, aqiRes, forecastRes, geoRes] = await Promise.all([
        fetchWithTimeout(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetchWithTimeout(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
        fetchWithTimeout(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetchWithTimeout(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`)
      ]);

      if (!currentRes.ok) throw new Error(`Current weather API failed: ${currentRes.status}`);
      if (!aqiRes.ok) throw new Error(`AQI API failed: ${aqiRes.status}`);
      if (!forecastRes.ok) throw new Error(`Forecast API failed: ${forecastRes.status}`);

      current = await currentRes.json();
      var aqiData = await aqiRes.json();
      var forecastData = await forecastRes.json();
      const geoData = geoRes.ok ? await geoRes.json() : [];
      
      // Use more precise location name if available
      if (geoData && geoData.length > 0) {
        const place = geoData[0];
        current.name = place.state ? `${place.name}, ${place.state}` : place.name;
      }

      var aqi = aqiData.list?.[0];
      var forecastList = forecastData.list || [];

    } else {
      const currentUrl = `${BASE_URL}/weather?q=${encodeURIComponent(city || 'Navi Mumbai')}&appid=${API_KEY}&units=metric`;
      const currentRes = await fetchWithTimeout(currentUrl);
      if (!currentRes.ok) {
        const errorText = await currentRes.text();
        throw new Error(`Location not found (${currentRes.status}): ${errorText}`);
      }
      
      current = await currentRes.json();
      lat = current.coord.lat;
      lon = current.coord.lon;

      // Fetch AQI and Forecast with defensive error handling
      const [aqiRes, forecastRes] = await Promise.all([
        fetchWithTimeout(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`).catch(() => null),
        fetchWithTimeout(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`).catch(() => null)
      ]);

      var aqiData = aqiRes && aqiRes.ok ? await aqiRes.json() : { list: [] };
      var forecastData = forecastRes && forecastRes.ok ? await forecastRes.json() : { list: [] };
      
      var aqi = aqiData.list?.[0];
      var forecastList = forecastData.list || [];
    }

    // Process daily forecast (sampled every 8 hours for variety)
    const dailyForecast = forecastList.filter((_: any, i: number) => i % 8 === 0).slice(0, 5);
    
    // Process hourly forecast (next 12 hours)
    const hourlyForecast = forecastList.slice(0, 12).map((h: any) => ({
      dt: h.dt,
      temp: Math.round(h.main?.temp || 0),
      description: h.weather?.[0]?.description || 'Clear',
      humidity: h.main?.humidity || 0,
      rainChance: Math.round((h.pop || 0) * 100)
    }));

    const weatherData = {
      location: current.name,
      country: current.sys?.country,
      temp: Math.round(current.main?.temp || 0),
      humidity: current.main?.humidity || 0,
      windSpeed: current.wind?.speed || 0,
      windDeg: current.wind?.deg || 0,
      description: current.weather?.[0]?.description || 'Clear',
      mainCondition: current.weather?.[0]?.main || 'Clear',
      icon: current.weather?.[0]?.icon,
      feelsLike: Math.round(current.main?.feels_like || 0),
      tempMax: Math.round(current.main?.temp_max || 0),
      tempMin: Math.round(current.main?.temp_min || 0),
      pressure: current.main?.pressure || 0,
      visibility: (current.visibility || 0) / 1000,
      sunrise: current.sys?.sunrise ? new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
      sunset: current.sys?.sunset ? new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
      rawSunrise: current.sys?.sunrise,
      rawSunset: current.sys?.sunset,
      timezone: current.timezone,
      dt: current.dt,
      aqi: aqi?.main?.aqi || 1,
      aqiComponents: aqi?.components || {},
      lat,
      lon,
      hourly: hourlyForecast,
      forecast: dailyForecast.map((f: any) => ({
        date: new Date(f.dt * 1000).toLocaleDateString([], { weekday: 'short' }),
        temp: Math.round(f.main?.temp || 0),
        min: Math.round((f.main?.temp_min || 0) - 1),
        max: Math.round((f.main?.temp_max || 0) + 1),
        description: f.weather?.[0]?.description || 'Clear',
        icon: f.weather?.[0]?.icon,
        rainChance: Math.round((f.pop || 0) * 100)
      }))
    };

    // Update Cache
    if (latParam && lonParam) {
      globalCache.set(`weather-${lat}-${lon}`, { data: weatherData, timestamp: Date.now() });
    }

    return NextResponse.json({
      success: true,
      data: weatherData
    }, {

      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    console.error("[API Error]", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Location not found or API failure." 
    }, { status: 500 });
  }
}
