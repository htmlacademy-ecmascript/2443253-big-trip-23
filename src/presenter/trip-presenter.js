import SortListView from '../view/sort-list-view.js';
import FormCreateEditView from '../view/form-create-edit.js';
import TripNoEventView from '../view/no-point-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import FilterListView from '../view/filter-list-view.js';
import PointPresenter from './point-presenter.js';

import {render} from '../framework/render.js';
import {BLANK_POINT} from '../model/points-model.js';
import {generateFilter} from '../utils/filter.js';
import {generateSorter} from '../utils/sort.js';
import {updateItem} from '../utils/common.js';
import {sortDay, sortPrice, sortTime} from '../utils/point.js';

const DEFAULT_FILTER = 'everything';
const DEFAULT_SORT_TYPE = 'day';
export default class TripPresenter {


  #tripContainer = null;
  #filterListContainer = null;
  #filterListView = null;
  #tripNoEventView = null;
  #sortListView = null;
  #pointsModel = null;
  #newEventComponent = null;


  //Рабочий массив точек маршрута
  #tripPoints = [];
  //Исходный немутированный массив точек маршрута
  #sourceTripPoints = [];

  //Текущий метод фильтрации
  #currentFilterType = DEFAULT_FILTER;

  #filters = [];
  #sorters = [];

  //Коллекция презентеров точек маршрута
  #pointPresenters = new Map();


  #tripEventListComponent = new TripEventListView();

  constructor({tripContainer,filterContainer,pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterListContainer = filterContainer;
    document.querySelector('.trip-main__event-add-btn').addEventListener('click',this.#newEventHandler);
  }


  init() {
    this.#tripPoints = [...this.#pointsModel.points];

    //Сортировка по умолчанию по датам: от старых к новым
    this.#sortPoints(DEFAULT_SORT_TYPE);

    this.#sourceTripPoints = [...this.#pointsModel.points];
    //Фильтры
    this.#filters = generateFilter(this.#pointsModel.points);
    //Сортировка
    this.#sorters = generateSorter(this.#pointsModel.points);


    render(this.#tripEventListComponent, this.#tripContainer);
    this.#renderFilters();
    this.#renderSorters();
    this.#renderTrip();
  }

  //Перерисовать список фильтров
  #renderFilters(){
    this.#filterListView = new FilterListView({filters : this.#filters,currentFilter:this.#currentFilterType,
      onFilterClick: this.#handleFilterClick});
    render(this.#filterListView, this.#filterListContainer);
  }

  //Перерисовать список сортировки
  #renderSorters(){
    this.#sortListView = new SortListView({sorters : this.#sorters,
      onSortClick : this.#SortClickHandler});

    render(this.#sortListView, this.#tripContainer,'afterbegin');
  }


  //Сортируем по типу
  #sortPoints(sortType){
    switch (sortType) {
      case 'day':
        this.#tripPoints.sort(sortDay);
        break;
      case 'time':
        this.#tripPoints.sort(sortTime);
        break;
      case 'price':
        this.#tripPoints.sort(sortPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourceTripPoints];
    }


  }

  //обработчик создания новой точки
  #newEventHandler = (evt) =>{
    evt.preventDefault();
    if (!this.#newEventComponent){
      this.#newEventComponent = new FormCreateEditView({point:BLANK_POINT,
        onSubmitClick: this.#newEventSubmitHandler,
        onCancelClick: this.#newEventCancelHandler,
        isEditForm : false});
      render(this.#newEventComponent, this.#tripContainer,'afterbegin');

      this.#refreshSortDefaultFilter(DEFAULT_FILTER);
    }
  };

  //Добавляем точку
  #newEventSubmitHandler = ()=>{

  };

  //Отмена добавления точки
  #newEventCancelHandler = ()=>{
    this.#newEventComponent.element.remove();
    this.#newEventComponent = null;
  };

  //Обработчик сортировки
  #SortClickHandler = (sortType) =>{
    //сортировка
    this.#sortPoints(sortType);
    //очистка и рендеринг
    this.#clearPointPresenters();
    //Отрисовка
    this.#renderTrip();

  };


  //Фильтруем по типу
  #filterPoints(filterType){
    switch (filterType) {
      case 'everything':
        this.#tripPoints = [...this.#sourceTripPoints];
        break;
      default:
        this.#tripPoints = this.#filters.find((element) => element.type === filterType).tripPoints;
    }


  }

  //сброс на сортировку по умолчанию и переключение на указанную в параметрах фильтрацию
  #refreshSortDefaultFilter(filterType){
    this.#currentFilterType = filterType;

    //Фильтруем
    this.#filterPoints(filterType);
    //очистка и рендеринг
    this.#clearPointPresenters();
    //Сортировка по умолчанию по датам: от старых к новым
    this.#sortPoints(DEFAULT_SORT_TYPE);
    //Отрисовка
    this.#renderTrip();
    //Перерисуем блок сортировки
    this.#sortListView.element.remove();
    this.#sortListView = null;
    this.#renderSorters();
    //Перерисуем блок фильтров
    this.#filterListView.element.remove();
    this.#filterListView = null;
    this.#renderFilters();

  }

  //Обработчик - фильтрации
  #handleFilterClick = (filterType) =>{
    this.#refreshSortDefaultFilter(filterType);
  };

  //Отрисуем к точки маршрутов, если они есть
  #renderTrip() {

    if (this.#tripPoints.length > 0) {
      this.#renderPoints();
    } else {
      this.#renderNoPoint();
    }
  }

  //Заглушка при отсутствии точек
  #renderNoPoint(){
    this.#tripNoEventView = new TripNoEventView({currentFilter: this.#currentFilterType});
    render(this.#tripNoEventView, this.#tripContainer);
  }

  //Рисует все точки маршрута
  #renderPoints(){
    this.#tripPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  //Рисует одну точку маршрута
  #renderPoint (point) {
    const pointPresenter = new PointPresenter({tripEventListComponent:this.#tripEventListComponent.element,
      onPointUpdate: this.#handlePointUpdate,
      onModeChange: this.#handleModeChange});
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

    if(this.#tripNoEventView){
      this.#tripNoEventView.element.remove();
    }
    this.#pointPresenters.clear();
  }

  #handlePointUpdate = (updatedPoint) =>{
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

}


