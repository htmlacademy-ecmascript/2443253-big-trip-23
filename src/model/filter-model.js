import Observable from '../framework/observable.js';
import {DEFAULT_FILTER} from '../const.js';

export default class FilterModel extends Observable {
  #filter = DEFAULT_FILTER;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
