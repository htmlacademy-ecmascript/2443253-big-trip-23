import {humanizeDate,capitalize,DATE_FORMAT_WITHOUT_TIME,humanizeDiffDates} from '..//utils/point.js';
import AbstractView from '../framework/view/abstract-view.js';
import {OFFERS} from '../const.js';


/**Наследуемый класс для отображения точки путешествия
 * @constructor {Object} - точка путешествия
*/
export default class TripEventView extends AbstractView{
  #point = null;
  #handleEventClick = null;
  #handleFavoriteClick = null;


  constructor ({point, onEditClick,onFavoriteClick}){
    super();
    this.#point = point;
    this.#handleEventClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #isClassFavorite = (isFavorite) => isFavorite ? 'event__favorite-btn--active' : '';

  #favoriteClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #editClickHandler = (evt)=> {
    evt.preventDefault();
    this.#handleEventClick();
  };


  get template() {
    const {basePrice,dateFrom,dateTo,time,destination,isFavorite,offers : pointoffers,availableOffers,type} = this.#point;
    const offersForView = availableOffers.filter((elem) =>
      pointoffers.includes(elem));


    return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime=${dateFrom}>${humanizeDate(dateFrom,DATE_FORMAT_WITHOUT_TIME)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(type)} ${destination.town}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${dateFrom}>${humanizeDate(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime=${dateTo}>${humanizeDate(dateTo)}</time>
        </p>
        <p class="event__duration">${humanizeDiffDates(time)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <span class="event__offer-title">${offersForView.map((el) => OFFERS[el].name).join(', ')}
            </span>
          ${offersForView.length > 0 ? '&plus;&euro;&nbsp' : ''}
          <span class="event__offer-price">${offersForView.map((el) => OFFERS[el].price).join(', ')}</span>
        </li>
      </ul>
      <button class="event__favorite-btn ${this.#isClassFavorite(isFavorite)}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg  class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
  }
}
