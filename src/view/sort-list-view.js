import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '..//utils/point.js';
import { DEFAULT_SORT_TYPE, SortType,CHECKED } from '../const.js';


const statesSort = {
  'day': 'checked',
  'event':'disabled',
  'offer':'disabled',
  'price':'',
  'time':''
};

export default class SortListView extends AbstractView{


  #sorters = null;
  #handleSortClick = null;
  #prevSortType = SortType.DAY;

  constructor({sorters,onSortClick,currentSortType}) {
    super();
    this.#handleSortClick = onSortClick;
    this.#sorters = sorters;
    this.#prevSortType = currentSortType;
    this.element.addEventListener('click',this.#SortListHandler);

  }

  resetSorters(){
    statesSort[DEFAULT_SORT_TYPE] = CHECKED;
    statesSort[SortType.PRICE] = '';
    statesSort[SortType.TIME] = '';
  }

  #SortListHandler = (evt) => {
    const sortType = evt.target.dataset.sortType;
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    if (this.#prevSortType !== sortType && ((sortType === SortType.PRICE) || (sortType === SortType.TIME) || (sortType === SortType.DAY))){
      statesSort[this.#prevSortType] = '';
      this.#prevSortType = sortType;
      statesSort[sortType] = CHECKED;

      this.#handleSortClick(sortType);
    }

  };

  #createSortItemTemplate(element) {
    const {type: sortingType} = element;
    return `<div class="trip-sort__item  trip-sort__item--${sortingType}">
    <input id="sort-${sortingType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingType}"  ${statesSort[sortingType]}
    ${statesSort[sortingType]}></input>
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
