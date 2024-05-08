import {getRandomPoint} from '../mock/point.js';
import {DESTIRNATIONS} from '../const.js';
const POINT_COUNT = 5;

const BLANK_POINT = {
  id: POINT_COUNT,
  basePrice: 100,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: DESTIRNATIONS[3],
  isFavorite: false,
  offers: [
    {name:'Добавить багаж',price:300}
  ],
  type: 'train'
};


export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }
}
export {POINT_COUNT,BLANK_POINT};
