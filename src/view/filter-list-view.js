import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '..//utils/point.js';


export default class FilterListView extends AbstractView{

  #filters = null;
  #filterEventClick = null;
  #currentFilterType = null;
  #prevFilterType = null;

  constructor({filters,currentFilterType,onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#filterEventClick = onFilterTypeChange;
    this.#currentFilterType = currentFilterType;
    this.element.addEventListener('click', this.#filterClickHandler);
  }

  #filterClickHandler = (evt)=> {
    this.#currentFilterType = evt.target.dataset.filterType;

    if (evt.target.tagName !== 'LABEL'){
      return;
    }
    if (this.#prevFilterType !== this.#currentFilterType){
      this.#prevFilterType = this.#currentFilterType;
      this.#filterEventClick(this.#currentFilterType);
    }
  };


  #createFilterItemTemplate(filter, isChecked) {
    const {type, count} = filter;
    return `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''}>
      <label class="trip-filters__filter-label" data-filter-type="${type}" for="filter-${type}">${capitalize(type)} ${count}</label>
    </div>`;
  }

  get template() {
    const currentFilterIndex = this.#filters.findIndex((filter) => filter.type === this.#currentFilterType);
    return `<form class="trip-filters" action="#" method="get">
          ${this.#filters.map((element,index) => this.#createFilterItemTemplate(element,index === currentFilterIndex))
    .join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
  }

}
