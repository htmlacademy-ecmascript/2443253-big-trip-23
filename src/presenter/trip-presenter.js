import SortListView from '../view/sort-list-view.js';
import FormCreateView from '../view/form-create-view.js';
import FormEditView from '../view/form-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripNoEventView from '../view/no-point-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import FilterListView from '../view/filter-list-view.js';

import {render,replace} from '../framework/render.js';
import {BLANK_POINT} from '../model/points-model.js';
import {generateFilter} from '../mock/filter.js';
import {generateSorter} from '../mock/sort.js';


export default class TripPresenter {


  #tripContainer = null;
  #filterListContainer = null;
  #pointsModel = null;
  #tripPoints = [];
  #filters = [];
  #sorters = [];


  #formCreateComponent = new FormCreateView(BLANK_POINT);
  #tripEventListComponent = new TripEventListView();

  constructor({tripContainer,filterContainer,pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterListContainer = filterContainer;
  }


  init() {
    this.#tripPoints = [...this.#pointsModel.points];

    this.#filters = generateFilter(this.#pointsModel.points);
    this.#sorters = generateSorter(this.#pointsModel.points);
    render(new FilterListView({filters : this.#filters,
      onFilterClick: () => {
        //Показать точки маршрута по выбранному фильтру
        //Как получить наименование выбранного фильтра???
      }
    }), this.#filterListContainer);

    this.#renderTrip();
  }

  #renderTrip() {
    if (this.#tripPoints.length > 0) {
      render(new SortListView({sorters : this.#sorters}), this.#tripContainer);
      render(this.#formCreateComponent, this.#tripContainer);
      render(this.#tripEventListComponent, this.#tripContainer);
      this.#tripPoints.forEach((point) => {
        this.#renderPoint(point);
      });
    } else {
      render(new TripNoEventView(), this.#tripContainer);
    }
  }


  #renderPoint (point) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointViewComponent = new TripEventView({
      point,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new FormEditView({
      point,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceFormToPoint(){
      replace(pointViewComponent,pointEditComponent);
    }
    function replacePointToForm(){
      replace(pointEditComponent,pointViewComponent);
    }

    render(pointViewComponent, this.#tripEventListComponent.element);
  }
}

