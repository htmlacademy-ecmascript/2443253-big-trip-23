import { BLANK_POINT } from '../model/points-model.js';
import FormCommon from './form-common.js';

export default class FormCreateView extends FormCommon{
  #point = null;


  constructor ({point = BLANK_POINT}){
    super(point);
    this.#point = point;
  }

  get template() {
    return this._createEventForm(false);
  }
}
