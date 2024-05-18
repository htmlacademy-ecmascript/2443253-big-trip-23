import FormCommon from './form-common.js';


export default class FormEditView extends FormCommon{
  #handleFormSubmit = null;

  constructor ({point,onFormSubmit}){
    super(point);
    this.#handleFormSubmit = onFormSubmit;
    this._restoreHandlers();


  }

  reset(point) {
    this.updateElement(
      FormEditView.parsePointToState(point),
    );
  }

  _restoreHandlers(){
    this.element.addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#hideClickHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    //Установим событие календарь при выборе дат
    this._setDatePicker(this._state.dateFrom,'#event-start-time-1',this.#dateFromChangeHandler);
    this._setDatePicker(this._state.dateTo,'#event-end-time-1',this.#dateToChangeHandler);
  }


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
    this.#handleFormSubmit(FormEditView.parseStateToPoint(this._state));
  };

  #hideClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit();
  };


  get template() {
    return this._createEventForm(true);
  }
}
