"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCityByName } from "../../api/getAllCity";
import { findWeatherCity } from "../../api/findWeatherCity";

interface CityData {
  geoname_id: string;
  name: string;
  ascii_name: string;
  cou_name_en: string;
  country_code: string;
  population: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  timezone: string;
}

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function WeatherDetails() {
  const params = useParams();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get city details
        const cityResponse = await getCityByName({ name: params.id as string });
        if (cityResponse.results && cityResponse.results.length > 0) {
          const city = cityResponse.results[0];
          setCityData(city);
          
          // Get weather data
          const weatherResponse = await findWeatherCity(city.name);
          setWeatherData(weatherResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City not found</h1>
          <Link href="/home" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link href="/home" className="text-blue-500 hover:underline">
          ← Back to Cities
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">{cityData.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Location Details</h2>
              <p>Country: {cityData.cou_name_en}</p>
              <p>Country Code: {cityData.country_code}</p>
              <p>Population: {cityData.population?.toLocaleString()}</p>
              <p>Timezone: {cityData.timezone}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Coordinates</h2>
              <p>Latitude: {cityData.coordinates?.lat}</p>
              <p>Longitude: {cityData.coordinates?.lon}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Weather Information</h2>
              {weatherData ? (
                <div>
                  <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
                  <p>Feels like: {Math.round(weatherData.main.feels_like - 273.15)}°C</p>
                  <p>Weather: {weatherData.weather[0].main}</p>
                  <p>Description: {weatherData.weather[0].description}</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                  <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
              ) : (
                <p className="text-gray-500">Weather data not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 