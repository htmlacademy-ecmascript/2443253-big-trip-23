
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const filterListContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({tripContainer: tripEventsContainer,filterContainer : filterListContainer, pointsModel});


tripPresenter.init();
