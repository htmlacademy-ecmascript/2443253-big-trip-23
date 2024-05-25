
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import FilterPresenter from './presenter/filter-presenter.js';

const filterListContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');


const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripContainer: tripEventsContainer,
  filterContainer : filterListContainer,
  pointsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterListContainer,
  filterModel,
  pointsModel
});

filterPresenter.init();
tripPresenter.init();
