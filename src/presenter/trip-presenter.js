import SortListView from '../view/sort-list-view.js';

import ManageFormView from '../view/manage-form-view.js';
import NoPointView from '../view/no-point-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import PointPresenter from './point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import {render,remove,RenderPosition} from '../framework/render.js';
import {BLANK_POINT} from '../model/points-model.js';
import {generateSorter} from '../utils/sort.js';
import {filter} from '../utils/filter.js';


import {sortByDay, sortByPrice, sortByTime} from '../utils/point.js';
import {SortType,DEFAULT_SORT_TYPE,UserAction,UpdateType, DEFAULT_FILTER,LOADING,FAIL_LOAD,ESCAPE_KEY} from '../const.js';

const BlockerTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class TripPresenter {


  //Коллекция презентеров точек маршрута
  #pointPresenters = new Map();


  #tripContainer = null;
  #filterListView = null;
  #noPointView = null;

  #sortListView = null;
  #pointsModel = null;
  #filterModel = null;
  #newEventComponent = null;
  //Компонент LOADING...
  #loadingComponent = new NoPointView({currentFilter : LOADING});
  //Компонент FAIL_LOAD...
  #failLoadComponent = new NoPointView({currentFilter : FAIL_LOAD});

  //объект блокировщик

  #uiBlocker = new UiBlocker({
    lowerLimit: BlockerTimeLimit.LOWER_LIMIT,
    upperLimit: BlockerTimeLimit.UPPER_LIMIT
  });

  #newPointButton = document.querySelector('.trip-main__event-add-btn');


  //Текущий метод сортировки
  #currentSortType = DEFAULT_SORT_TYPE;

  #sorters = [];


  #tripEventListComponent = new TripEventListView();

  constructor({tripContainer,pointsModel,filterModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointButton.disabled = true;


    this.#pointsModel.addObserver(this.#modelChangeHandler);
    this.#filterModel.addObserver(this.#modelChangeHandler);

    this.#newPointButton.addEventListener('click',this.#newPointCreateHandler);


  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredTasks = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredTasks.sort(sortByDay);
      case SortType.TIME:
        return filteredTasks.sort(sortByTime);
      case SortType.PRICE:
        return filteredTasks.sort(sortByPrice);
      default:
        return filteredTasks;
    }
  }


  init() {
    //Сортировка
    this.#sorters = generateSorter(this.#pointsModel.points);


    render(this.#loadingComponent, this.#tripContainer,RenderPosition.AFTERBEGIN);
    render(this.#tripEventListComponent, this.#tripContainer);
  }


  //Перерисовать список сортировки
  #renderSorters(){
    this.#sortListView = new SortListView({sorters : this.#sorters,
      onSortClick : this.#sortButtonClickHandler,currentSortType : this.#currentSortType});

    render(this.#sortListView, this.#tripContainer,RenderPosition.AFTERBEGIN);
  }

  //Установка флагов для обратной связи
  setSaving() {
    this.#newEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  //Тряска при ошибке обращения к серверу
  setAborting(component,updateAfterShake = true) {
    const resetFormState = () => {
      if (updateAfterShake){
        component.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      }
    };

    component.shake(resetFormState);
  }

  //Очищаем список точек, секции фильтрации и сортировки
  #clearPointsSection(resetSort = false){
    this.#clearPointPresenters();
    if (resetSort) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
      this.#sortListView.resetSorters();
    }
    remove(this.#sortListView);
    remove(this.#filterListView);
  }


  //Отрисуем к точки маршрутов, если они есть
  #renderTrip() {
    const points = this.points;

    this.#renderSorters();

    this.#renderPoints(points);
  }

  //Заглушка при отсутствии точек
  #renderNoPoint(){
    this.#noPointView = new NoPointView({currentFilter: this.#filterModel.filter});
    render(this.#noPointView, this.#tripContainer);
  }

  //Рисует все точки маршрута
  #renderPoints(points){

    if (points.length > 0) {
      points.forEach((point) => {
        this.#renderPoint(point);
      });
    } else
    if (!this.#newEventComponent){
      this.#renderNoPoint();
    }

  }

  //Рисует одну точку маршрута
  #renderPoint (point) {
    const pointPresenter = new PointPresenter({tripEventListComponent:this.#tripEventListComponent.element,
      onPointUpdate: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler,
      pointsModel: this.#pointsModel});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id,pointPresenter);
  }

  //Очистка всех представлений
  #clearPointPresenters(){
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
    remove(this.#noPointView);
  }

  //-------------------------------------------------Обработчики---------------------------------------

  //Обновление модели по действию пользователя
  #viewActionHandler = async (actionType, updateType, update) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try{
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err){
          this.#pointPresenters.get(update.id).setAborting();
          this.#uiBlocker.unblock();
          return false;
        }
        break;
      case UserAction.CHANGE_FAVORITE:
        try{
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err){
          this.setAborting(this.#tripEventListComponent,false);
          this.#uiBlocker.unblock();
          return false;
        }
        break;
      case UserAction.ADD_POINT:
        this.setSaving();
        try{
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err){
          this.setAborting(this.#newEventComponent);
          this.#uiBlocker.unblock();
          return false;
        }

        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try{
          await this.#pointsModel.deletePoint(updateType, update);

        }catch(err){
          this.#pointPresenters.get(update.id).setAborting();
          this.#uiBlocker.unblock();
          return false;
        }
        break;
    }
    this.#uiBlocker.unblock();
    return true;
  };


  //Реакция на обновление модели
  #modelChangeHandler = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.SMALL:
        // - обновить часть списка ()
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MIDDLE:
        // - обновить список ()
        this.#clearPointPresenters();
        this.#renderPoints(this.points);
        break;
      case UpdateType.BIG:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearPointsSection(true);
        this.#renderTrip();

        break;
      case UpdateType.INIT:
        if (data){
          this.#newPointButton.disabled = false;
          remove(this.#loadingComponent);
          this.#renderTrip();
        } else{
          remove(this.#loadingComponent);
          render(this.#failLoadComponent, this.#tripContainer,RenderPosition.AFTERBEGIN);
        }

        break;
    }
  };


  //обработчик создания новой точки
  #newPointCreateHandler = (evt) =>{
    this.#newPointButton.disabled = true;
    this.#filterModel.filterType = DEFAULT_FILTER;
    remove(this.#noPointView);


    evt.preventDefault();
    if (!this.#newEventComponent){
      this.#newEventComponent = new ManageFormView({
        point: {...BLANK_POINT,availableOffers: this.#pointsModel.adaptToClientAvailableOffers(BLANK_POINT.type)},
        onSubmitClick: this.#newPointFormSubmitHandler,
        onDeleteClick: this.#newPointFormCancelHandler,
        pointsModel: this.#pointsModel,
        isEditForm : false});
      document.addEventListener('keydown', this.#escKeyDownHandler);
      render(this.#newEventComponent, this.#tripContainer,RenderPosition.AFTERBEGIN);

      this.#currentSortType = DEFAULT_SORT_TYPE;
      this.#sortListView.resetSorters();
      this.#filterModel.setFilter(UpdateType.BIG, DEFAULT_FILTER);
    }
  };


  //Обработчик добавления точки
  #newPointFormSubmitHandler = (newpoint)=>{
    this.#newPointButton.disabled = false;

    this.#viewActionHandler(
      UserAction.ADD_POINT,
      UpdateType.MIDDLE,
      newpoint
    ).then((value) => {
      if (value){
        remove(this.#newEventComponent);
        this.#newEventComponent = null;
      }
    });


  };

  //Отмена добавления точки
  #newPointFormCancelHandler = ()=>{

    this.#newPointButton.disabled = false;
    remove(this.#newEventComponent);
    this.#newEventComponent = null;
    if(this.points.length === 0){
      this.#renderNoPoint();
    }
  };

  #escKeyDownHandler = (evt) =>{
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this.#newPointFormCancelHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  //Обработчик сортировки
  #sortButtonClickHandler = (sortType) =>{
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointsSection();
    //Отрисовка
    this.#renderTrip();

  };

  //Обработчик сброса всех форм редактирования
  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    //И сброс создания новой точки
    this.#newPointFormCancelHandler();
  };


}
