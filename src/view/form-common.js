
import AbstractStateFulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDate,capitalize,humanizeTime} from '..//utils/point.js';
import {OFFERS,EVENT_TYPES, DESTIRNATIONS} from '../const.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


export default class FormCommon extends AbstractStateFulView{

  _idEditForm = false;
  #datepicker = null;

  constructor (point){
    super();
    this._setState(FormCommon.parsePointToState(point));
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более не нужный календарь
  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  _setDatePicker(date,elementID,dateElementHandler) {

    this.#datepicker = flatpickr(
      this.element.querySelector(elementID),
      {
        defaultDate: date,
        onChange: dateElementHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  static parsePointToState(point) {
    return {...point
    };
  }

  static parseStateToPoint(state) {
    return {...state};
  }

  _createDestinationImage = (image) =>`<img class="event__photo" src="${image}" alt="Event photo">`;
  _createEventTypeItem(typeItem,state = '',id){
    return `<div class="event__type-item">
  <input id="event-type-${typeItem}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem} ${state}">
  <label class="event__type-label  event__type-label--${typeItem}" for="event-type-${typeItem}-${id}">${capitalize(typeItem)}</label>
  </div>`;
  }

  _createEventOfferItem({name,price},checked,id){
    return `
          <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-${id}" type="checkbox" name="event-offer-${name}" ${checked && 'checked'}>
              <label class="event__offer-label" for="event-offer-${name}-${id}">
                <span class="event__offer-title">${name}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>
    `;
  }


  _createEventForm(isEditFrom){
    const {basePrice,dateFrom,dateTo,destination,offers,type,id} = this._state;
    return `
    <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${EVENT_TYPES.find((element) => element === type)}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

      <div class="event__type-list" >
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${EVENT_TYPES.map((element) =>
    this._createEventTypeItem(element,id)).join('')}
          </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalize(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.town}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
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
    <button class="event__reset-btn" type="reset">${isEditFrom ? 'Delete' : 'Cancel'}</button>
    ${isEditFrom ? `<button class="event__rollup-btn" type="button">
               <span class="visually-hidden">Open event</span>
             </button>` : ''}

  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>


      <div class="event__available-offers">

    ${ isEditFrom ?
    offers.map((element) =>
      OFFERS.includes(element) ? this._createEventOfferItem(element,true,id) : this._createEventOfferItem(element,false,id)).join('')
    :
    OFFERS.map((element) =>
      offers.includes(element) ? this._createEventOfferItem(element,true,id) : this._createEventOfferItem(element,false,id)).join('')

}

      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.name}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${isEditFrom ? this._createDestinationImage(destination.foto) :
    DESTIRNATIONS.map((element) => this._createDestinationImage(element.foto))
}
        </div>
      </div>

    </section>
  </section>
  </form>`;
  }

  get template(){
    return this._createEventForm(true);
  }

}
