import {createElement} from '../render.js';
import {humanizeDate,capitalize,humanizeTime} from '../utils.js';
import dayjs from 'dayjs';


const isClassFavorite = (isFavorite) => isFavorite ? 'event__favorite-btn--active' : '';

function createTripEventTemplate(point) {
  const {basePrice,dateFrom,dateTo,destination,isFavorite,offers,type} = point;
  const date1 = dayjs(dateFrom),
    date2 = dayjs(dateTo);
  const diffDates = date2.diff(date1,'m');

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime=${dateFrom}>${humanizeDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${capitalize(type)} ${destination.town}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime=${dateFrom}>${humanizeTime(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime=${dateTo}>${humanizeTime(dateTo)}</time>
      </p>
      <p class="event__duration">${diffDates}M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      <li class="event__offer">
        <span class="event__offer-title">${offers.map((elem)=>elem.name)}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offers.map((elem)=>elem.price)}</span>
      </li>
    </ul>
    <button class="event__favorite-btn ${isClassFavorite(isFavorite)}" type="button">
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

export default class TripEventView {

  constructor ({point}){
    this.point = point;
  }

  getTemplate() {
    return createTripEventTemplate(this.point);
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
