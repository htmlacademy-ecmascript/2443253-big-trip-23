import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '..//utils/point.js';

export default class SortListView extends AbstractView{

  #SORT_TYPES = ['day', 'event', 'time', 'price','offer'];
  #STATES_SORT = ['', 'disabled', '', 'checked','disabled'];

  #createSortItemTemplate(sortingType, state = '') {
    return `<div class="trip-sort__item  trip-sort__item--${sortingType}">
    <input id="sort-${sortingType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingType}"  ${state}>
    <label class="trip-sort__btn" for="sort-${sortingType}">${capitalize(sortingType)}</label>
  </div>`;
  }

  get template() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${this.#SORT_TYPES.map((element,index) => this.#createSortItemTemplate(element,this.#STATES_SORT[index])).join('')
}
  </form>`;

  }

}
