
import FormCommon from './form-common.js';

export default class FormCreateView extends FormCommon{
  #formSubmitHandler = null;

  constructor ({point}){
    super(point);
    this._restoreHandlers();

  }

  _restoreHandlers(){
    this.element.addEventListener('submit',this.#formSubmitHandler);
  }

  get template() {
    return this._createEventForm(false);
  }
}
