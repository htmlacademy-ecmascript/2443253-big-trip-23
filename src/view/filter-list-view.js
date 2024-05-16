import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '..//utils/point.js';


export default class FilterListView extends AbstractView{

  #filters = null;
  #filterEventClick = null;
  #prevFilterType = null;

  constructor({filters,onFilterClick}) {
    super();
    this.#filters = filters;
    this.#filterEventClick = onFilterClick;
    this.element.addEventListener('click', this.#filterClickHandler);
  }

  #filterClickHandler = (evt)=> {
    const filterType = evt.target.dataset.filterType;
    if (evt.target.tagName !== 'LABEL'){
      return;
    }
    if (this.#prevFilterType !== filterType){
      this.#prevFilterType = filterType;
      this.#filterEventClick(filterType);
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

    return `<form class="trip-filters" action="#" method="get">
          ${this.#filters.map((element,index) => this.#createFilterItemTemplate(element,index === 0)).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
  }

}
