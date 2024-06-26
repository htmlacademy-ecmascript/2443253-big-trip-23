
import ManageFormView from '../view/manage-form-view.js';
import TripEventView from '../view/trip-event-view.js';
import {replace,render,remove} from '../framework/render.js';
import {UserAction, UpdateType,ESCAPE_KEY} from '../const.js';

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
  #pointsModel = null;
  #point = null;
  #mode = Mode.DEFAULT;


  constructor({tripEventListComponent,onPointUpdate,onModeChange,pointsModel}){
    this.#tripEventListComponent = tripEventListComponent;
    this.#handlePointUpdate = onPointUpdate;
    this.#handleModeChange = onModeChange;
    this.#pointsModel = pointsModel;

  }

  init(point){
    this.#point = point;
    const prevPointViewComponent = this.#pointViewComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointViewComponent = new TripEventView({
      point : this.#point,
      onEditClick: this.#editButtonClickHandler,
      onFavoriteClick: this.#favoriteButtonClickHandler
    });

    this.#pointEditComponent = new ManageFormView({
      point : this.#point,
      onSubmitClick: this.#formSubmitHandler,
      onDeleteClick: this.#deleteButtonClickHandler,
      onRollupClick: this.#rollupButtonClickHandler,
      pointsModel: this.#pointsModel,
      isEditForm : true
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
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.shake(resetFormState);
    }
  }

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

  //-------------------------------------------------------Обработчики-----------------------------------------------------
  //Нажатие звездочки
  #favoriteButtonClickHandler = () =>{
    this.#handlePointUpdate(
      UserAction.CHANGE_FAVORITE,
      UpdateType.MIDDLE,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  //Клик на редактирование
  #editButtonClickHandler = () => {
    this.#replacePointToForm(this.#pointViewComponent,this.#pointEditComponent);
  };

  #formSubmitHandler = (point) => {
    this.#handlePointUpdate(
      UserAction.UPDATE_POINT,
      UpdateType.MIDDLE,
      point);

  };

  //Клик на удаление
  #deleteButtonClickHandler = (point)=>{
    this.#handlePointUpdate(
      UserAction.DELETE_POINT,
      UpdateType.MIDDLE,
      point,
    );
  };

  //Клик на закрытие редактирования
  #rollupButtonClickHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();

    }
  };


  destroy(){
    remove(this.#pointViewComponent);
    remove(this.#pointEditComponent);
  }

}
