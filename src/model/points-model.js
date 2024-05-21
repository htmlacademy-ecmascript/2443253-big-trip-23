import {getRandomPoint} from '../mock/point.js';
const POINT_COUNT = 5;

const BLANK_POINT = {
  id: POINT_COUNT,
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: {name:'',town:'',foto:''},
  isFavorite: false,
  offers: [

  ],
  type: 'flight'
};


export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }
}
export {POINT_COUNT,BLANK_POINT};
