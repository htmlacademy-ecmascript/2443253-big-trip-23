import {SortType} from '../const.js';
import {comparePrice,compareTime} from '../utils/point.js';

const sorter = {
  [SortType.DAY]: (points) => [...points],
  [SortType.EVENT]: (points) => [...points],
  [SortType.OFFER]: (points) => [...points],
  [SortType.PRICE]: (points) => [...points].sort(comparePrice),
  [SortType.TIME]: (points) => [...points].sort(compareTime)
};
function generateSorter(points) {
  return Object.entries(sorter).map(
    ([sorterType, sorterPoints]) => ({
      type: sorterType,
      count: sorterPoints(points).length,
    }),
  );
}
export {sorter,generateSorter};

