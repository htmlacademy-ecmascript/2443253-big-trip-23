import {createElement} from '../render.js';
import {POINT_COUNT} from '../model/points-model.js';
import {humanizeDate,capitalize,humanizeTime} from '../utils.js';

import {createEventTypeItem,createEventOfferItem,CHECKED_INDEX} from './form-edit-view.js';
import {OFFERS,EVENT_TYPES, DESTIRNATIONS} from '../const.js';


const BLANK_POINT = {
  id: POINT_COUNT,
  basePrice: 100,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: DESTIRNATIONS[3],
  isFavorite: false,
  offers: [
    {name:'Добавить багаж',price:300}
  ],
  type: 'train'
};

const createDestinationImage = (image) =>`<img class="event__photo" src="${image}" alt="Event photo">`;


function createFormTemplate(point){
  const {basePrice,dateFrom,dateTo,destination,offers,type} = point;
  return `
  <form class="event event--edit" action="#" method="post">
<header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${EVENT_TYPES.map((element,index) => CHECKED_INDEX.includes(index) ? createEventTypeItem(element,'checked') : createEventTypeItem(element)).join('')}
      </fieldset>
    </div>
  </div>

  <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${capitalize(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.town}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom)} ${humanizeTime(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo)} ${humanizeTime(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Cancel</button>
</header>
<section class="event__details">
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>


    <div class="event__available-offers">
    ${OFFERS.map((element) =>
    offers.includes(element) ? createEventOfferItem(element,true) : createEventOfferItem(element,false)).join('')}

    </div>
  </section>

  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.name}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${DESTIRNATIONS.map((element) => createDestinationImage(element.foto))}
      </div>
    </div>

  </section>
</section>
</form>`;
}


export default class FormCreateView{
  getTemplate() {
    return createFormTemplate(BLANK_POINT);
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

export {createDestinationImage};
