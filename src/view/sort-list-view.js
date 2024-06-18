import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '..//utils/point.js';
import { DEFAULT_SORT_TYPE, SortType,CHECKED,LABEL_TAG } from '../const.js';

//Текущее состояние элементов сортировки
const sortStates = {
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
    this.element.addEventListener('click',this.#sortButtonClickHandler);

  }

  get template() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${this.#sorters.map((element) => this.#createSortItemTemplate(element)).join('')
}
  </form>`;

  }

  resetSorters(){
    sortStates[DEFAULT_SORT_TYPE] = CHECKED;
    sortStates[SortType.PRICE] = '';
    sortStates[SortType.TIME] = '';
  }


  #createSortItemTemplate(element) {
    const {type: sortingType} = element;
    return `<div class="trip-sort__item  trip-sort__item--${sortingType}">
    <input id="sort-${sortingType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingType}"  ${sortStates[sortingType]}
    ${sortStates[sortingType]}></input>
    <label class="trip-sort__btn" data-sort-type="${sortingType}" for="sort-${sortingType}">${capitalize(sortingType)}</label>
  </div>`;
  }

  //Клик на сортировку
  #sortButtonClickHandler = (evt) => {
    const sortType = evt.target.dataset.sortType;
    if (evt.target.tagName !== LABEL_TAG) {
      return;
    }
    if (this.#prevSortType !== sortType && ((sortType === SortType.PRICE) || (sortType === SortType.TIME) || (sortType === SortType.DAY))){
      sortStates[this.#prevSortType] = '';
      this.#prevSortType = sortType;
      sortStates[sortType] = CHECKED;

      this.#handleSortClick(sortType);
    }

  };

}
