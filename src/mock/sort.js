import {sorter} from '../utils/sort.js';

function generateSorter(points) {
  return Object.entries(sorter).map(
    ([sorterType, sorterPoints]) => ({
      type: sorterType,
      count: sorterPoints(points).length,
    }),
  );
}

export {generateSorter};
