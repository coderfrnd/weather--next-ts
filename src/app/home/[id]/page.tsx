  import { findWeatherCity } from "@/app/api/findWeatherCity";
  interface PageProps {
    params: { id: string };
  }
  export async function generateMetadata({ params }: PageProps) {
    return {
      title: `Weather in ${params.id}`,
    };
  }
  export default async function City({ params }: PageProps) {
    const cityId =  params.id;
    const weather = await findWeatherCity(cityId);
    
    const tempCelsius = Math.round(weather.main.temp - 273.15);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {weather.name}, {weather.sys.country}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-bold text-gray-800">{tempCelsius}°C</p>
                  <p className="text-gray-600 capitalize">{weather.weather[0].description}</p>
                </div>
                <img 
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="w-24 h-24"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600">Humidity</p>
                <p className="text-2xl font-semibold">{weather.main.humidity}%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600">Wind Speed</p>
                <p className="text-2xl font-semibold">{weather.wind.speed} m/s</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600">Pressure</p>
                <p className="text-2xl font-semibold">{weather.main.pressure} hPa</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600">Feels Like</p>
                <p className="text-2xl font-semibold">{Math.round(weather.main.feels_like - 273.15)}°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
