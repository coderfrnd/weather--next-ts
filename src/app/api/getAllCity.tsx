export async function getAllCity({limit, start = 0}: {limit: number, start?: number}) {
  const response = await fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${limit}&start=${start}`);
  const data = await response.json();
  return data;
}

export async function getCityByName({name}: {name: string}) {
  const response = await fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=name like "${name}*"`);
  const data = await response.json();
  return data;
}
