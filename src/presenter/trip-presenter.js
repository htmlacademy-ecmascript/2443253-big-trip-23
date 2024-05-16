import SortListView from '../view/sort-list-view.js';
import FormCreateView from '../view/form-create-view.js';
import TripNoEventView from '../view/no-point-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import FilterListView from '../view/filter-list-view.js';
import PointPresenter from './point-presenter.js';

import {render} from '../framework/render.js';
import {BLANK_POINT} from '../model/points-model.js';
import {generateFilter} from '../mock/filter.js';
import {generateSorter} from '../mock/sort.js';
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


  #formCreateComponent = new FormCreateView(BLANK_POINT);
  #tripEventListComponent = new TripEventListView();

  constructor({tripContainer,filterContainer,pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterListContainer = filterContainer;
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


    this.#filterListView = new FilterListView({filters : this.#filters,
      onFilterClick: this.#handleFilterClick});
    this.#sortListView = new SortListView({sorters : this.#sorters,
      onSortClick : this.#handleSortClick});

    render(this.#sortListView, this.#tripContainer);
    render(this.#formCreateComponent, this.#tripContainer);
    render(this.#tripEventListComponent, this.#tripContainer);
    render(this.#filterListView, this.#filterListContainer);

    this.#renderTrip();
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

  //Обработчик сортировки
  #handleSortClick = (sortType) =>{
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

  //Обработчик - фильтрации
  #handleFilterClick = (filterType) =>{
    this.#currentFilterType = filterType;
    //Фильтруем
    this.#filterPoints(filterType);
    //очистка и рендеринг
    this.#clearPointPresenters();
    //Сортировка по умолчанию по датам: от старых к новым
    this.#sortPoints(DEFAULT_SORT_TYPE);
    //Отрисовка
    this.#renderTrip();


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


