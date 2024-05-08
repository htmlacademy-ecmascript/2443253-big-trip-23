import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '..//utils/point.js';


export default class FilterListView extends AbstractView{

  #filters = null;
  #filterEventClick = null;

  constructor({filters,onFilterClick}) {
    super();
    this.#filters = filters;
    this.#filterEventClick = onFilterClick;
    this.#filters.map((element) => this.element.querySelector(`#filter-${element.type}`).addEventListener('click', this.#filterClickHandler));
  }

  #filterClickHandler = (evt)=> {
    evt.preventDefault();
    this.#filterEventClick();
  };


  #createFilterItemTemplate(filter, isChecked) {
    const {type, count} = filter;
    return `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''}
      ${count === 0 ? ' disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalize(type)} ${count}</label>
    </div>`;
  }

  get template() {

    return `<form class="trip-filters" action="#" method="get">
          ${this.#filters.map((element,index) => this.#createFilterItemTemplate(element,index === 0)).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
  }

}
