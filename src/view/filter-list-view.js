import {createElement} from '../render.js';
import {capitalize} from '../utils.js';


const FILTER_NAMES = ['everything', 'future', 'present', 'past'];
const STATES_FILTER = ['', '', '', '','checked'];

function createFilterItemTemplate(nameFilter, state = '') {
  return `<div class="trip-filters__filter">
    <input id="filter-${nameFilter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${nameFilter}"  ${state}>
    <label class="trip-filters__filter-label" for="filter-${nameFilter}">${capitalize(nameFilter)}</label>
  </div>`;
}

function createFiltersTemplate() {
  return `<form class="trip-filters" action="#" method="get">
          ${FILTER_NAMES.map((element,index) => createFilterItemTemplate(element,STATES_FILTER[index])).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterListView {
  getTemplate() {
    return createFiltersTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
