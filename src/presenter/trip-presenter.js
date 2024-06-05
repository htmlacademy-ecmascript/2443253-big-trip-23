import SortListView from '../view/sort-list-view.js';

import FormCreateEditView from '../view/manage-form-view.js';
import TripNoEventView from '../view/no-point-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import PointPresenter from './point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import {render,remove,RenderPosition} from '../framework/render.js';
import {BLANK_POINT} from '../model/points-model.js';
import {generateSorter} from '../utils/sort.js';
import {filter} from '../utils/filter.js';


import {sortDay, sortPrice, sortTime} from '../utils/point.js';
import {SortType,DEFAULT_SORT_TYPE,UserAction,UpdateType, DEFAULT_FILTER,LOADING} from '../const.js';

const BlockerTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class TripPresenter {


  //Коллекция презентеров точек маршрута
  #pointPresenters = new Map();


  #tripContainer = null;
  #filterListView = null;
  #tripNoEventView = null;

  #sortListView = null;
  #pointsModel = null;
  #filterModel = null;
  #newEventComponent = null;
  #loadingComponent = new TripNoEventView({currentFilter : LOADING});
  #uiBlocker = new UiBlocker({
    lowerLimit: BlockerTimeLimit.LOWER_LIMIT,
    upperLimit: BlockerTimeLimit.UPPER_LIMIT
  });

  #newPointButton = document.querySelector('.trip-main__event-add-btn');


  //Рабочий массив точек маршрута
  //#tripPoints = [];
  //Исходный немутированный массив точек маршрута
  //  #sourceTripPoints = [];

  //Текущий метод сортировки
  #currentSortType = DEFAULT_SORT_TYPE;

  #sorters = [];


  #tripEventListComponent = new TripEventListView();

  constructor({tripContainer,pointsModel,filterModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointButton.disabled = true;


    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointButton.addEventListener('click',this.#newEventHandler);


  }

  //Обновление модели
  #handleViewAction = async (actionType, updateType, update) => {
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
      case UserAction.ADD_POINT:
        this.setSaving();
        try{
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err){
          this.setAborting();
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
  #handleModelEvent = (updateType, data) => {
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
        this.#newPointButton.disabled = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
    }
  };


  init() {
    //Сортировка
    this.#sorters = generateSorter(this.#pointsModel.points);


    render(this.#loadingComponent, this.#tripContainer,RenderPosition.AFTERBEGIN);
    render(this.#tripEventListComponent, this.#tripContainer);
  }


  //Перерисовать список сортировки
  #renderSorters(){
    this.#sortListView = new SortListView({sorters : this.#sorters,
      onSortClick : this.#sortClickHandler,currentSortType : this.#currentSortType});

    render(this.#sortListView, this.#tripContainer,RenderPosition.AFTERBEGIN);
  }


  //обработчик создания новой точки
  #newEventHandler = (evt) =>{
    this.#newPointButton.disabled = true;
    this.#filterModel.filterType = DEFAULT_FILTER;


    evt.preventDefault();
    if (!this.#newEventComponent){
      this.#newEventComponent = new FormCreateEditView({
        point: {...BLANK_POINT,availableOffers: this.#pointsModel.adaptToClientAvailableOffers(BLANK_POINT.type)},
        onSubmitClick: this.#newEventSubmitHandler,
        onCancelDeleteClick: this.#newEventCancelHandler,
        pointsModel: this.#pointsModel,
        isEditForm : false});
      render(this.#newEventComponent, this.#tripContainer,RenderPosition.AFTERBEGIN);

      this.#currentSortType = DEFAULT_SORT_TYPE;
      this.#sortListView.resetSorters();
      this.#filterModel.setFilter(UpdateType.BIG, DEFAULT_FILTER);

    }
  };

  //Установка флагов для обратной связи
  setSaving() {
    this.#newEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  //Тряска при ошибке обращения к серверу
  setAborting() {
    const resetFormState = () => {
      this.#newEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newEventComponent.shake(resetFormState);
  }

  //Добавляем точку
  #newEventSubmitHandler = (newpoint)=>{
    this.#newPointButton.disabled = false;

    this.#handleViewAction(
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
  #newEventCancelHandler = ()=>{

    this.#newPointButton.disabled = false;
    remove(this.#newEventComponent);
    this.#newEventComponent = null;

  };


  //Обработчик сортировки
  #sortClickHandler = (sortType) =>{
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointsSection();
    //Отрисовка
    this.#renderTrip();

  };


  //Очищаем список точек, секции фильтрации и сортировки
  #clearPointsSection(resetSort = false){
    this.#clearPointPresenters();
    if (resetSort) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
      this.#sortListView.resetSorters();
    }
    remove(this.#sortListView);
    remove(this.#filterListView);
    remove(this.#tripNoEventView);
  }


  //Отрисуем к точки маршрутов, если они есть
  #renderTrip() {
    const points = this.points;

    this.#renderSorters();

    if (points.length > 0) {
      this.#renderPoints(points);
    } else {
      this.#renderNoPoint();
    }
  }

  //Заглушка при отсутствии точек
  #renderNoPoint(){
    this.#tripNoEventView = new TripNoEventView({currentFilter: this.#filterModel.filter});
    render(this.#tripNoEventView, this.#tripContainer);
  }

  //Рисует все точки маршрута
  #renderPoints(points){
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  //Рисует одну точку маршрута
  #renderPoint (point) {
    const pointPresenter = new PointPresenter({tripEventListComponent:this.#tripEventListComponent.element,
      onPointUpdate: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      pointsModel: this.#pointsModel});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id,pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  //Очистка всех представлений
  #clearPointPresenters(){
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredTasks = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredTasks.sort(sortDay);
      case SortType.TIME:
        return filteredTasks.sort(sortTime);
      case SortType.PRICE:
        return filteredTasks.sort(sortPrice);
      default:
        return filteredTasks;
    }
  }


}
