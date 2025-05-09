export async function findWeatherCity(city: string) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=717ce1b714ff92b67f550b196b2dd511`);
  const data = await response.json();
  return data;
}

// https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=717ce1b714ff92b67f550b196b2dd511
