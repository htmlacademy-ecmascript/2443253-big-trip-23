
import TripPresenter from './presenter/trip-presenter.js';


const tripMainElement = document.querySelector('.trip-main');
const tripPresenter = new TripPresenter({tripContainer: tripMainElement});

tripPresenter.init();
