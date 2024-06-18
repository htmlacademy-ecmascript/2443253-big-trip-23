

import {FilterType, UpdateType} from '../const.js';
import FilterListView from '../view/filter-list-view.js';
import {render,replace,remove} from '../framework/render.js';
import {filter} from '../utils/filter.js';

export default class FilterPresenter {

  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterListView = null;

  constructor({filterContainer, filterModel, pointsModel}){
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#modelChangeHandler);
    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }


  init(){
    const filters = this.filters;
    const prevFilterListView = this.#filterListView;

    this.#filterListView = new FilterListView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterChange
    });


    if (prevFilterListView === null){
      render(this.#filterListView, this.#filterContainer);
      return;
    }
    replace(this.#filterListView, prevFilterListView);

    remove(prevFilterListView);

  }

  //Обработчик - смены типа фильтра
  #handleFilterChange = (filterType) =>{
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.BIG, filterType);
  };

  //Обработчик события при подписке на изменение модели
  #modelChangeHandler = () => {
    this.init();
  };
}
