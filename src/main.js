
import TripPresenter from './presenter/trip-presenter.js';
import TotalInfoPresenter from './presenter/total-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic eo0w103ir29899d';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';


const filterListContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const totalInfoContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

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

tripPresenter.init();
totalInfoPresenter.init();

pointsModel.init().finally(() => {
  filterPresenter.init();
});


