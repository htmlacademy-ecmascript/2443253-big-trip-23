
import TripPresenter from './presenter/trip-presenter.js';
import TotalInfoPresenter from './presenter/total-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const filterListContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const totalInfoContainer = document.querySelector('.trip-main');


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
const totalInfoPresenter = new TotalInfoPresenter({
  totalInfoContainer : totalInfoContainer,
  pointsModel});

filterPresenter.init();
tripPresenter.init();
totalInfoPresenter.init();


