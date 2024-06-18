
import AbstractStateFulView from '../framework/view/abstract-stateful-view.js';
import {capitalize} from '../utils/point.js';
import {EVENT_TYPES,MAX_DAYS_TRIP_POINT} from '../const.js';
import {BLANK_POINT} from '../model/points-model.js';
import dayjs from 'dayjs';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


export default class ManageFormView extends AbstractStateFulView{

  _isEditForm = false;
  #startDateChanged = false;
  #endDateChanged = false;
  #point = null;
  #datepicker = null;
  #handleFormSubmit = null;
  #handleFormCancelDelete = null;
  #destinationElement = null;
  #pointsModel = null;
  #handleformRollup = null;


  constructor ({point,onSubmitClick,onDeleteClick,isEditForm,pointsModel,onRollupClick}){
    super();
    this.#point = point;
    this._isEditForm = isEditForm;
    this.#pointsModel = pointsModel;
    this.#handleFormSubmit = onSubmitClick;
    this.#handleFormCancelDelete = onDeleteClick;
    this.#handleformRollup = onRollupClick;
    this._setState(ManageFormView.parsePointToState(this.#point));
    this._restoreHandlers();
  }

  get template(){
    return this._createEventForm(this._isEditForm);
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

  reset(point) {
    this.updateElement(
      ManageFormView.parsePointToState(point),
    );
  }

  _createDestinationImage = (destination) =>{
    const {name,pictures} = destination;
    if(name.length > 0 || pictures.length > 0) {
      return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${name.length > 0 ? `<p class="event__destination-description">${name}</p>` : ''}
      ${pictures.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${pictures.map((picture)=>`<img class="event__photo" src="${picture.src}" alt=${picture.description}>`)}
        </div>
      </div>
    </section>` : ''}`;
    }
    return '';
  };


  _createEventTypeItem = (typeItem,id,state = '') => `<div class="event__type-item">
  <input id="event-type-${typeItem}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem}" ${state}>
  <label class="event__type-label  event__type-label--${typeItem}" for="event-type-${typeItem}-${id}">${capitalize(typeItem)}</label>
  </div>`;

  _createEventOfferItem = (offer,checked,id,offerIndex) =>{
    const {title,price} = offer;
    return `
          <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerIndex}-${id}" type="checkbox" name="event-offer-${title}" ${checked && 'checked'}>
              <label class="event__offer-label" for="event-offer-${offerIndex}-${id}">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>
    `;
  };


  _createEventForm(isEditFrom){
    const {basePrice,destination,offers,availableOffers,type,id,
      isDeleting,isSaving,isDisabled
    } = this._state;

    let deleteCancelButtonText = '';

    if (isEditFrom && isDeleting) {
      deleteCancelButtonText = 'Deleting';
    }else if (isEditFrom && !isDeleting){
      deleteCancelButtonText = 'Delete';
    } else {
      deleteCancelButtonText = 'Cancel';
    }

    return `
    ${isEditFrom ? '<li class="trip-events__item">' : ''}
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.town}" list="destination-list-${id}" placeholder = "Выберите пункт назначения" required>
          <datalist id="destination-list-${id}">
            ${this.#pointsModel.destinations.map((item) =>`<option value="${item.name}"></option>`)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" placeholder=">0"name="event-price" value="${basePrice}"  required>
        </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${deleteCancelButtonText}</button>
    ${isEditFrom ? `<button class="event__rollup-btn" type="button">
               <span class="visually-hidden">Open event</span>
             </button>` : ''}

  </header>
  <section class="event__details">

  ${(availableOffers.length > 0) ?
    `<section class="event__section  event__section--offers">

      <h3 class="event__section-title  event__section-title--offers">Offers</h3>` : ''}

      <div class="event__available-offers">
    ${availableOffers.map((element,index) => this._createEventOfferItem(element,offers.includes(element),id,index)).join('')}
      </div>
      ${(availableOffers.length > 0) ? '</section>' : ''}
    ${destination.town ? this._createDestinationImage(destination) : ''}
</section>
  </form>
  ${isEditFrom ? '</li>' : ''}`;
  }


  _setDatePicker(date,minDate,maxDate,elementID,dateChangeHandler) {


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
        onChange: dateChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _restoreHandlers(){

    this.#destinationElement = this.element.querySelector('.event__input--destination');
    this.#destinationElement.addEventListener('change', this.#destinationInputChangeHandler);
    this.element.addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('click',this.#typeInputChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputChangeHandler);
    this._setDatePicker(this._state.dateFrom,'0',this._state.dateTo,'#event-start-time-1',this.#dateFromInputChangeHandler);
    this._setDatePicker(this._state.dateTo,this._state.dateFrom,this._state.dateFrom.fp_incr(MAX_DAYS_TRIP_POINT),'#event-end-time-1',this.#dateToInputChangeHandler);

    this.element.addEventListener('reset',this.#cancelButtonClickHandler);

    if(this._isEditForm){
      this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#rollupButtonClickHandler);
    } else {
      if (!this.#startDateChanged){
        this.element.querySelector('#event-start-time-1').value = '';
      }
      if (!this.#endDateChanged){
        this.element.querySelector('#event-end-time-1').value = '';
      }
    }


    this.element.querySelector('.event__available-offers')
      .addEventListener('click', this.#offerButtonClickHandler);
  }

  //--------------------------------------------Обработчики------------------------------------

  //Меняем доп. услугу
  #offerButtonClickHandler = (evt) =>{
    const newOffers = [...this._state.offers];
    evt.preventDefault();
    let checkedElement;

    //Выберем нужный элемент в зависимости от того куда кликнул пользователь
    switch(evt.target.className){
      case 'event__offer-label': checkedElement = evt.target.previousElementSibling; break;
      case 'event__offer-title': checkedElement = evt.target.closest('label').previousElementSibling; break;
      case 'event__offer-price': checkedElement = evt.target.closest('label').previousElementSibling; break;
      case 'event__offer-checkbox': checkedElement = evt.target; break;
      default: return;
    }

    this._state.availableOffers.forEach((offer,index) =>{
      const id = `event-offer-${index}-${this._state.id}`;
      if (checkedElement.id === id){
        if(!checkedElement.checked){
          newOffers.push(offer);
        } else {
          newOffers.splice(newOffers.indexOf(offer),1);
        }

      }

    });
    newOffers.map((element) => {
      if(!element){
        element = 0;
      }
    });
    this.updateElement({
      offers: [...newOffers],
    });

  };

  //Меняем тип
  #typeInputChangeHandler = (evt) =>{
    let newType = null,
      availableOffers = [];
    evt.preventDefault();
    newType = EVENT_TYPES.find((typeItem) => evt.target.className.includes(typeItem));
    availableOffers = this.#pointsModel.adaptToClientAvailableOffers(newType);
    this._setState({
      type: newType,
      availableOffers: availableOffers,
      offers:[],
    });
    this.updateElement({
      type: newType,
      availableOffers: availableOffers,
      offers:[],
    });

  };

  //Меняем пункт назначения
  #destinationInputChangeHandler = (evt)=>{
    evt.preventDefault();
    const destinations = [...this.#pointsModel.destinations];
    let newDest = destinations.find((dest) => dest.name === evt.target.value);
    if (!destinations.includes(newDest)){
      newDest = BLANK_POINT.destination;
    }
    this.updateElement({
      destination: this.#pointsModel.adaptToClientDestination(newDest)
    });
  };

  //Меняем начальную дату
  #dateFromInputChangeHandler = ([userDate]) => {
    this.#startDateChanged = true;
    this.updateElement({
      dateFrom: userDate,
    });
  };

  //Меняем конечную дату
  #dateToInputChangeHandler = ([userDate]) => {
    this.#endDateChanged = true;
    this.updateElement({
      dateTo: userDate,
    });
  };

  //Меняем цену
  #priceInputChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #formSubmitHandler = (evt) =>{
    evt.preventDefault();
    this._setState({
      time: dayjs(this._state.dateTo).diff(dayjs(this._state.dateFrom), 'minute')
    });


    this.#handleFormSubmit(ManageFormView.parseStateToPoint(this._state));
  };

  //Клик на rollup
  #rollupButtonClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleformRollup();
  };


  //Отмена добавления точки в форме создания или удаление в форме редактирования
  #cancelButtonClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormCancelDelete(ManageFormView.parseStateToPoint(this._state));
  };

  //--------------------------------Статические методы---------------------------
  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
