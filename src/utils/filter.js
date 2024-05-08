import {FilterType} from '../const.js';
import {isPointToday, isPointWillBe,isPointExpired} from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointWillBe(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointToday(point.dateFrom,point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.dateTo))
};

export {filter};

