import {SortType} from '../const.js';

const sorter = {
  [SortType.DAY]: (points) => [...points],
  [SortType.EVENT]: (points) => [...points],
  [SortType.OFFER]: (points) => [...points],
  [SortType.PRICE]: (points) => [...points],
  [SortType.TIME]: (points) => [...points]
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

