import {EVENT_TYPES, DESTINATIONS,AVAILABLE_OFFERS_FOR_TYPE} from '../const.js';
import {getRandomArrayElement,getRandomInteger,getRandomArray} from '../utils/common.js';
import { nanoid } from 'nanoid';


const MIN_PRICE = 10;
const MAX_PRICE = 3000;

const mockPoints = [
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: new Date('2024.06.14'),
    dateTo: new Date('2024.06.16'),
    time : 48,
    destination: getRandomArrayElement(DESTINATIONS),
    isFavorite: true,
    type: getRandomArrayElement(EVENT_TYPES)


  },
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: new Date('2024.08.01'),
    dateTo: new Date('2024.08.05'),
    time : 96,
    destination: getRandomArrayElement(DESTINATIONS),
    isFavorite: false,
    type: getRandomArrayElement(EVENT_TYPES)

  },
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: new Date('2024.05.01'),
    dateTo: new Date('2024.06.01'),
    time : 744,
    destination: getRandomArrayElement(DESTINATIONS),
    isFavorite: true,
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: new Date('2024.07.01'),
    dateTo: new Date('2024.07.08'),
    time : 168,
    destination: getRandomArrayElement(DESTINATIONS),
    isFavorite: true,
    type: getRandomArrayElement(EVENT_TYPES)
  }
];


const getRandomPoint = () => {
  const randomPoint = getRandomArrayElement(mockPoints);
  return { id : nanoid(),
    availableOffers: AVAILABLE_OFFERS_FOR_TYPE [randomPoint.type],
    offers: getRandomArray(AVAILABLE_OFFERS_FOR_TYPE [randomPoint.type]),
    ...randomPoint
  };
};
export {getRandomPoint};
