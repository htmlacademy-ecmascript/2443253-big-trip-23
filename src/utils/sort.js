import {SortType} from '../const.js';
import {comparePrice,compareTime} from '../utils/point.js';

const sorter = {
  [SortType.DAY]: (points) => [...points],
  [SortType.EVENT]: (points) => [...points],
  [SortType.OFFER]: (points) => [...points],
  [SortType.PRICE]: (points) => [...points].sort(comparePrice),
  [SortType.TIME]: (points) => [...points].sort(compareTime)
};
export {sorter};

