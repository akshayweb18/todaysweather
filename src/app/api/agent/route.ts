import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');

    let currentRes;
    if (latParam && lonParam) {
      currentRes = await axios.get(`${BASE_URL}/weather`, {
        params: { lat: latParam, lon: lonParam, appid: API_KEY, units: 'metric' }
      });
    } else {
      currentRes = await axios.get(`${BASE_URL}/weather`, {
        params: { q: city || 'Navi Mumbai', appid: API_KEY, units: 'metric' }
      });
    }
    const current = currentRes.data;
    const { lat, lon } = current.coord;

    // 2. Get Air Pollution (AQI)
    const aqiRes = await axios.get(`${BASE_URL}/air_pollution`, {
      params: { lat, lon, appid: API_KEY }
    });
    const aqi = aqiRes.data.list[0];

    // 3. Get 5-Day Forecast
    const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: API_KEY, units: 'metric' }
    });
    const forecast = forecastRes.data.list.filter((_: any, i: number) => i % 8 === 0).slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        location: current.name,
        country: current.sys.country,
        temp: Math.round(current.main.temp),
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        description: current.weather[0].description,
        mainCondition: current.weather[0].main,
        icon: current.weather[0].icon,
        feelsLike: Math.round(current.main.feels_like),
        pressure: current.main.pressure,
        visibility: current.visibility / 1000,
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aqi: aqi.main.aqi, // 1-5 scale
        aqiComponents: aqi.components,
        forecast: forecast.map((f: any) => ({
          date: new Date(f.dt * 1000).toLocaleDateString([], { weekday: 'short' }),
          temp: Math.round(f.main.temp),
          description: f.weather[0].description,
          icon: f.weather[0].icon
        }))
      }
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Location not found or API failure." }, { status: 500 });
  }
}
