import {getRandomPoint} from '../mock/point.js';
import Observable from '../framework/observable.js';
import {AVAILABLE_OFFERS_FOR_TYPE} from '../const.js';

const POINT_COUNT = 5;

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: {name:'',town:'',foto:''},
  isFavorite: false,
  availableOffers: AVAILABLE_OFFERS_FOR_TYPE ['flight'],
  offers : [],
  type: 'flight'
};


export default class PointsModel extends Observable{
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }

  //Метод обновления задачи
  updateTask(updateType, update) {
    const index = this.#points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  //Метод добавления задачи
  addTask(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  //Метод удаления задачи
  deleteTask(updateType, update) {
    const index = this.#points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
export {POINT_COUNT,BLANK_POINT};
