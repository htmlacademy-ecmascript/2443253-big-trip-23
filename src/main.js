
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';


const pointsModel = new PointsModel();
const tripMainElement = document.querySelector('.trip-main');
const tripPresenter = new TripPresenter({tripContainer: tripMainElement,pointsModel});

tripPresenter.init();
