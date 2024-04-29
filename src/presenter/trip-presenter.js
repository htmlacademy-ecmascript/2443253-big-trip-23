import FilterListView from '../view/filter-list-view.js';
import SortListView from '../view/sort-list-view.js';
import FormCreateView from '../view/form-create-view.js';
import FormEditView from '../view/form-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import {render} from '../render.js';

const filterListContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');


export default class TripPresenter {
  filterComponent = new FilterListView();
  sortComponent = new SortListView();
  formCreateComponent = new FormCreateView();
  tripEventListComponent = new TripEventListView();
  tripFormEditComponent = new FormEditView();


  constructor({elementContainer }) {
    this.elementContainer = elementContainer;
  }

  init() {
    render(this.filterComponent, filterListContainer);
    render(this.sortComponent, tripEventsContainer);
    render(this.formCreateComponent, tripEventsContainer);
    render(this.tripEventListComponent, tripEventsContainer);
    render(this.tripFormEditComponent, this.tripEventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripEventView(), this.tripEventListComponent.getElement());
    }
  }
}
