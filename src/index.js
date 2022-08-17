import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './countries-api';
// import prewiewMarkup from './markup';
// import singleCountryMarkup from './markup';

// const prewMarkup = prewiewMarkup();
// const singleCounMarkup = singleCountryMarkup();

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let searchValue = '';

refs.searchInput.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(evt) {
  searchValue = evt.target.value.trim();

  API(searchValue)
    .then(data => {
      console.log(data);
      if (data.status === 404) {
        onIncorrectInput();
      }
      if (data.length >= 10) {
        onTooManyResults();
        refs.countryList.textContent = '';
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      } else if (data.length === 1) {
        renderSingleCountry(data);
      }
    })
    .catch(error => console.log(error));
}

function onIncorrectInput() {
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onTooManyResults() {
  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function prewiewMarkup({ flags, name }) {
  return `
    <li class="country-list__item">
    <img class="country-list__flag" width="30px" height="20px" src="${flags.svg}"></img>
    <p class="country-list__name">${name.official}</p>
    </li>`;
}

function singleCountryMarkup({ flags, name, capital, population, languages }) {
  const lang = Object.values(languages).join(', ');

  return `
  <div class="country-list__item">
  <img class="country-list__flag" width="60px" height="40px" src="${flags.svg}"></img>
  <p class="country-list__name accent">${name.official}</p></div>
  <div class="description">
  <p class="description__name">Capital: <span>${capital}</span><p>
  <p class="description__name">Population: <span>${population}</span></p>
  <p class="description__name">Languages: <span>${lang}</span></p>
  </div>`;
}

function renderCountryList(list) {
  const markup = list.map(prewiewMarkup).join('');
  refs.countryList.innerHTML = markup;
  refs.countryInfo.textContent = '';
}

function renderSingleCountry(country) {
  const markup = country.map(singleCountryMarkup).join('');
  refs.countryInfo.innerHTML = markup;
  refs.countryList.textContent = '';
}

export default { onIncorrectInput, onTooManyResults };
