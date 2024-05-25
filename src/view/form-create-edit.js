
import AbstractStateFulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDate,capitalize} from '../utils/point.js';
import {OFFERS,EVENT_TYPES, DESTINATIONS,MAX_DAYS_TRIP_POINT} from '../const.js';
import {BLANK_POINT} from '../model/points-model.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


export default class FormCreateEditView extends AbstractStateFulView{

  _isEditForm = false;
  #point = null;
  #datepicker = null;
  #handleFormSubmit = null;
  #handleformCancel = null;

  constructor ({point,onSubmitClick,onCancelClick,isEditForm}){
    super();
    this.#point = point;
    this._isEditForm = isEditForm;
    this.#handleFormSubmit = onSubmitClick;
    this.#handleformCancel = onCancelClick;
    this._setState(FormCreateEditView.parsePointToState(this.#point));
    this._restoreHandlers();
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

  _restoreHandlers(){
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputHandler);
    this.element.addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('click',this.#eventTypeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this._setDatePicker(this._state.dateFrom,'today',this._state.dateTo.fp_incr(-1),'#event-start-time-1',this.#dateFromChangeHandler);
    this._setDatePicker(this._state.dateTo,this._state.dateFrom,this._state.dateFrom.fp_incr(MAX_DAYS_TRIP_POINT),'#event-end-time-1',this.#dateToChangeHandler);

    this.element.addEventListener('reset',this.#formCancelHandler);

    if(this._isEditForm){
      this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#hideClickHandler);


    }
    this.element.querySelector('.event__offer-selector')
      .addEventListener('click', this.#offerInputHandler);

    // event__offer-title

  }

  //Меняем доп. услугу
  #offerInputHandler = (evt) =>{
    const newOffers = [...this.#point.offers];
    // evt.preventDefault();
    const checkedId = evt.target.id;


    this.#point.availableOffers.map((offer) =>{
      const id = `event-offer-${OFFERS[offer].name}-${this.#point.id}`;
      if (checkedId === id){
        //const index = newOffers.indexOf(offer);
        if(evt.target.checked){
          newOffers.push(offer);
        }

      }

    });
    this.updateElement({
      offers: newOffers,
    });
  };

  //Меняем тип
  #eventTypeHandler = (evt) =>{
    let newType = null;
    evt.preventDefault();
    newType = EVENT_TYPES.find((typeItem) => evt.target.className.includes(typeItem));
    this.updateElement({
      type: newType,
    });
  };


  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #formSubmitHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit(FormCreateEditView.parseStateToPoint(this._state));
  };

  #hideClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };


  #formCancelHandler = (evt) =>{
    evt.preventDefault();
    this.#handleformCancel(FormCreateEditView.parseStateToPoint(this._state));
  };

  reset(point) {
    this.updateElement(
      FormCreateEditView.parsePointToState(point),
    );
  }


  _setDatePicker(date,minDate,maxDate,elementID,dateElementHandler) {

    this.#datepicker = flatpickr(
      this.element.querySelector(elementID),
      {
        enableTime:true,
        dateFormat: 'd/m/y H:i',
        minDate: minDate,
        maxDate: maxDate,
        defaultDate: date,
        // eslint-disable-next-line camelcase
        time_24hr: true,
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

  #destinationInputHandler = (evt)=>{
    evt.preventDefault();
    let newDest = DESTINATIONS.find((dest) => dest.town === evt.target.value);
    if (!newDest){
      newDest = BLANK_POINT.destination;
    }
    this.updateElement({
      destination: newDest
    });
  };


  _createDestinationImage = (destination) =>{
    const {name,foto} = destination;
    return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${name}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
        <img class="event__photo" src="${foto}" alt="Event photo">
        </div>
      </div>
    </section>`;
  };


  _createEventTypeItem = (typeItem,id,state = '') => `<div class="event__type-item">
  <input id="event-type-${typeItem}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem}" ${state}>
  <label class="event__type-label  event__type-label--${typeItem}" for="event-type-${typeItem}-${id}">${capitalize(typeItem)}</label>
  </div>`;

  _createEventOfferItem = (offer,checked,id) =>{
    const {name,price} = offer;
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
  };


  _createEventForm(isEditFrom){
    const {basePrice,dateFrom,dateTo,destination,offers,availableOffers,type,id} = this._state;
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
            ${DESTINATIONS.map((dest) =>`<option value="${dest.town}"></option>`)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo)}">
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

    ${availableOffers.map((element) => this._createEventOfferItem(OFFERS[element],offers.includes(element),id)).join('')}



      </div>
    </section>
    ${destination.town ? this._createDestinationImage(destination) : ''}
</section>
  </form>`;
  }

  get template(){
    return this._createEventForm(this._isEditForm);
  }

}
