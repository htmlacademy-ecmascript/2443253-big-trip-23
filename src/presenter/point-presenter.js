
import FormEditView from '../view/form-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import {replace,render,remove} from '../framework/render.js';

const Mode = {
  DEFAULT:'DEFAULT',
  EDITING:'EDITING',
};

export default class PointPresenter {
  #tripEventListComponent = null;
  #pointViewComponent = null;
  #pointEditComponent = null;
  #handlePointUpdate = null;
  #handleModeChange = null;
  #point = null;
  #mode = Mode.DEFAULT;


  constructor({tripEventListComponent,onPointUpdate,onModeChange}){
    this.#tripEventListComponent = tripEventListComponent;
    this.#handlePointUpdate = onPointUpdate;
    this.#handleModeChange = onModeChange;
  }

  init(point){
    this.#point = point;
    const prevPointViewComponent = this.#pointViewComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointViewComponent = new TripEventView({
      point : this.#point,
      onEditClick: this.#editClickHandler,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#pointEditComponent = new FormEditView({
      point : this.#point,
      onFormSubmit: this.#submitFormHandler
    });

    if ((prevPointViewComponent === null) || (prevPointEditComponent === null)){
      render(this.#pointViewComponent, this.#tripEventListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT){
      replace(this.#pointViewComponent,prevPointViewComponent);
    }

    if (this.#mode === Mode.EDITING){
      replace(this.#pointEditComponent,prevPointEditComponent);
    }

    remove(prevPointViewComponent);
    remove(prevPointEditComponent);


  }

  resetView(){
    if (this.#mode !== Mode.DEFAULT){
      this.#replaceFormToPoint();
    }
  }

  destroy(){
    remove(this.#pointViewComponent);
    remove(this.#pointEditComponent);
  }


  #favoriteClickHandler = () =>{
    this.#handlePointUpdate({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #editClickHandler = () => {
    this.#replacePointToForm(this.#pointViewComponent,this.#pointEditComponent);
  };

  #submitFormHandler = () => {
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };


  #replaceFormToPoint(){
    replace(this.#pointViewComponent,this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToForm(){
    replace(this.#pointEditComponent,this.#pointViewComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }


}
