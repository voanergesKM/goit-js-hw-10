export default function fetchCountries(name) {
  const url = 'https://restcountries.com/v3.1/name/';
  const options = '?fields=name,capital,population,flags,languages';
  return fetch(`${url}${name}${options}`).then(result => result.json());
}
