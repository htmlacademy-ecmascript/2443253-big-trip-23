import AbstractView from '../framework/view/abstract-view.js';
export default class TripNoEventView extends AbstractView{
  #currentFilter = null;
  // Значение отображаемого текста зависит от выбранного фильтра:
  //   * Everthing – 'Click New Event to create your first point'
  //   * Past — 'There are no past events now';
  //   * Present — 'There are no present events now';
  //   * Future — 'There are no future events now'.
  constructor ({currentFilter}){
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return this.#selectItemTemplate(this.#currentFilter);
  }

  #selectItemTemplate(filterType = 'everthing'){
    switch (filterType){
      case 'everything':
        return '<p class="trip-events__msg">Click New Event to create your first point</p>';
      case 'past':
        return '<p class="trip-events__msg">There are no past events now</p>';
      case 'present':
        return '<p class="trip-events__msg">There are no present events now</p>';
      case 'future':
        return '<p class="trip-events__msg">There are no future events now</p>';
      case 'init':
        return '<p class="trip-events__msg">Loading...</p>';
      case 'failload':
        return '<p class="trip-events__msg">Failed to load latest route information</p>';

    }
  }

}
