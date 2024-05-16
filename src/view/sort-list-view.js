import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '..//utils/point.js';

export default class SortListView extends AbstractView{

  STATES_SORT = {
    'day': 'disabled',
    'event':'disabled',
    'offer':'disabled',
    'price':'',
    'time':''
  };

  #sorters = null;
  #handleSortClick = null;
  prevSortType = 'day';

  constructor({sorters,onSortClick}) {
    super();
    this.#handleSortClick = onSortClick;
    this.#sorters = sorters;
    this.element.addEventListener('click',this.#SortListHandler);

  }

  #SortListHandler = (evt) => {
    const sortType = evt.target.dataset.sortType;
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    if (this.prevSortType !== sortType && ((sortType === 'price') || (sortType === 'time'))){
      this.#handleSortClick(sortType);
      this.STATES_SORT[this.prevSortType] = '';
      this.prevSortType = sortType;
      this.STATES_SORT[sortType] = 'checked';
    }

  };

  #createSortItemTemplate(element) {
    const {type: sortingType} = element;
    return `<div class="trip-sort__item  trip-sort__item--${sortingType}">
    <input id="sort-${sortingType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingType}"  ${this.STATES_SORT[sortingType]}></input>
    <label class="trip-sort__btn" data-sort-type="${sortingType}" for="sort-${sortingType}">${capitalize(sortingType)}</label>
  </div>`;
  }

  get template() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${this.#sorters.map((element) => this.#createSortItemTemplate(element)).join('')
}
  </form>`;

  }

}
