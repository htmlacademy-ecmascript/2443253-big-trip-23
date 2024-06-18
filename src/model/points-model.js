import Observable from '../framework/observable.js';
import {addMinutes} from '../utils/point.js';
import {DEFAULT_TYPE_TRIP} from '../const.js';
import {UpdateType,MIN_MINUTES_TRIP_POINT} from '../const.js';
import dayjs from 'dayjs';

const POINT_COUNT = 5;

//Шаблон новой точки маршрута
const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: addMinutes(new Date(),MIN_MINUTES_TRIP_POINT),
  destination: {name:'', town: '', pictures:[]},
  isFavorite: false,
  availableOffers: [],
  offers : [],
  type: DEFAULT_TYPE_TRIP
};


//Класс модели точки маршрута
export default class PointsModel extends Observable{
  #points = [];
  #destinations = null;
  #offers = null;
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    let isSuccessLoad = true;
    try {
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;
      const points = await this.#pointsApiService.points;
      this.#points = points.map((point) => this.#adaptToClient(point));


    } catch(error) {
      this.#destinations = [];
      isSuccessLoad = false;
    }

    this._notify(UpdateType.INIT,isSuccessLoad);
  }


  //Метод обновления задачи

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  //Метод добавления задачи
  async addPoint(updateType, update) {

    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }

  }

  //Метод удаления задачи
  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  adaptToClientDestination(destination){
    return {
      name : destination.description,
      town : destination.name,
      id : destination.id,
      pictures : destination.pictures
    };

  }

  //Доступные предложения для данного типа путешествия
  adaptToClientAvailableOffers(type){
    return this.#offers.find((offer) => offer.type === type).offers;
  }

  //Выбранные предложения для данной точки
  #adaptToClientOffers(point,offers){
    const pointTypeOffers = offers.find((offer) => offer.type === point.type);
    return pointTypeOffers.offers.filter((offer) =>point.offers.includes(offer.id));

  }

  #adaptToClient(point) {

    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'], // На клиенте дата хранится как экземпляр Date
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'], // На клиенте дата хранится как экземпляр Date
      isFavorite: point['is_favorite'],
      availableOffers : this.adaptToClientAvailableOffers(point.type),
      destination : this.adaptToClientDestination(this.#destinations.find((destination) => destination.id === point.destination)),
      offers : this.#adaptToClientOffers(point,this.#offers)
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];


    //Добавим продолжительность
    return {time: dayjs(adaptedPoint.dateTo).diff(dayjs(adaptedPoint.dateFrom), 'minute'),
      ...adaptedPoint
    };

  }


}
export {POINT_COUNT,BLANK_POINT};
