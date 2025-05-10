"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllCity, getCityByName } from "../api/getAllCity";

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

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const [city, setCity] = useState(initialSearch);
  const [weather, setWeather] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update URL when city changes
  useEffect(() => {
    if (city.trim()) {
      router.replace(`/home?q=${encodeURIComponent(city.trim())}`);
    } else {
      router.replace(`/home`);
    }
  }, [city, router]);

  // Fetch initial data or search results on mount and when city changes
  useEffect(() => {
    if (!city.trim()) {
      setLoading(true);
      getAllCity({ limit, start: 0 })
        .then((data) => {
          setWeather(data.results || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      return;
    }
    setLoading(true);
    getCityByName({ name: city.trim() })
      .then((data) => {
        setWeather(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  // Autocomplete suggestions
  useEffect(() => {
    if (!city.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const data = await getCityByName({ name: city.trim() });
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [city]);

  function searchCity(name: string) {
    setCity(name);
  }

  function TrUi({ name }: { name: string }) {
    return (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        {name}
      </th>
    );
  }

  function TdUi({ item }: { item: CityData }) {
    const columns = [
      {
        render: () => (
          <>
            <div className="text-sm font-medium text-gray-900">{item.name}</div>
            {item.ascii_name && item.ascii_name !== item.name && (
              <div className="text-sm text-gray-500">{item.ascii_name}</div>
            )}
          </>
        ),
      },
      {
        render: () => (
          <>
            <div className="text-sm text-gray-900">{item.cou_name_en}</div>
            <div className="text-sm text-gray-500">{item.country_code}</div>
          </>
        ),
      },
      {
        render: () => item.population?.toLocaleString(),
      },
      {
        render: () =>
          item.coordinates && (
            <>
              <div>Lat: {item.coordinates.lat}</div>
              <div>Lon: {item.coordinates.lon}</div>
            </>
          ),
      },
      {
        render: () => item.timezone,
      },
    ];

    return (
      <>
        {columns.map((column, index) => (
          <td
            key={index}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          >
            {column.render()}
          </td>
        ))}
      </>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2 relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          className="p-2 border rounded w-full max-w-md"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <button
          onClick={() => searchCity(city.trim())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full max-w-md mt-12 rounded shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <li
                key={item.geoname_id}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onMouseDown={() => {
                  setCity(item.name);
                  setShowSuggestions(false);
                  searchCity(item.name);
                }}
              >
                {item.name} {item.cou_name_en ? `(${item.cou_name_en})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "City Name",
                "Country",
                "Population",
                "Coordinates",
                "Timezone",
              ].map((name) => (
                <TrUi key={name} name={name} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 cursor-pointer">
            {weather?.map((item) => (
              <tr
                key={item.geoname_id}
                className="hover:bg-gray-50"
                onClick={() => router.push(`/weather/${item.name}`)}
              >
                <TdUi item={item} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading more cities...</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
