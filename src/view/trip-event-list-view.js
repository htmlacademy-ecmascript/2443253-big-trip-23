import AbstractStateFulView from '../framework/view/abstract-stateful-view.js';


/**Наследуемый класс для отображения списка для точек путешествия

*/
export default class TripEventListView extends AbstractStateFulView{
  get template() {
    return '<ul class="trip-events__list"></ul>';
  }

  _restoreHandlers(){

  }
}
