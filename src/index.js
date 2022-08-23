import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './countries-api';
import { prewiewMarkup, singleCountryMarkup } from './markup';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let searchCountry = '';

refs.searchInput.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(evt) {
  searchCountry = evt.target.value.trim();

  clearMarkup();

  if (!searchCountry || !evt.data) {
    return;
  } else {
    API(searchCountry)
      .then(data => {
        if (data.length === 1) {
          renderSingleCountry(data);
        } else if (data.length >= 2 && data.length <= 10) {
          renderCountryList(data);
        } else {
          onTooManyResults();
          clearMarkup();
        }
      })
      .catch(error => {
        onIncorrectInput();
        console.log(error);
      });
  }
}

function renderCountryList(list) {
  const markup = list.map(prewiewMarkup).join('');
  refs.countryList.innerHTML = markup;
}

function renderSingleCountry(country) {
  const markup = country.map(singleCountryMarkup).join('');
  refs.countryInfo.innerHTML = markup;
}

function onIncorrectInput() {
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onTooManyResults() {
  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function clearMarkup() {
  refs.countryInfo.textContent = '';
  refs.countryList.textContent = '';
}
