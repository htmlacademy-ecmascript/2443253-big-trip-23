import { BLANK_POINT } from '../model/points-model.js';
import FormCommon from './form-common.js';


export default class FormEditView extends FormCommon{
  #handleFormSubmit = null;

  constructor ({point = BLANK_POINT,onFormSubmit}){
    super(point);
    this.#handleFormSubmit = onFormSubmit;
    this.element.addEventListener('submit',this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#hideClickHandler);
  }

  #formSubmitHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #hideClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleFormSubmit();
  };


  get template() {
    return this._createEventForm(true);
  }
}
