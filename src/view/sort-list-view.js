import {createElement} from '../render.js';
import {capitalize} from '../utils.js';

const SORT_TYPES = ['day', 'event', 'time', 'price','offer'];
const STATES_SORT = ['', 'disabled', '', 'checked','disabled'];

function createSortItemTemplate(sortingType, state = '') {
  return `<div class="trip-sort__item  trip-sort__item--${sortingType}">
  <input id="sort-${sortingType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingType}"  ${state}>
  <label class="trip-sort__btn" for="sort-${sortingType}">${capitalize(sortingType)}</label>
</div>`;
}

function createSortTemplate() {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SORT_TYPES.map((element,index) => createSortItemTemplate(element,STATES_SORT[index])).join('')
}
</form>`;
}

export default class SortListView {
  getTemplate() {
    return createSortTemplate();
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
