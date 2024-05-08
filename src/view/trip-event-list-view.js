import AbstractView from '../framework/view/abstract-view.js';


/**Наследуемый класс для отображения списка для точек путешествия

*/
export default class TripEventListView extends AbstractView{
  get template() {
    return '<ul class="trip-events__list"></ul>';
  }
}
