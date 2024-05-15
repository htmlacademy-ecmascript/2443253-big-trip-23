import {EVENT_TYPES, OFFERS,DESTIRNATIONS} from '../const.js';
import {getRandomArrayElement,getRandomInteger} from '../utils/common.js';
import { nanoid } from 'nanoid';


const MIN_PRICE = 10;
const MAX_PRICE = 3000;

const mockPoints = [
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: '2024.06.14',
    dateTo: '2024.06.16',
    time : 48,
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: true,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: '2024.08.01',
    dateTo: '2024.08.05',
    time : 96,
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: false,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: '2024.05.01',
    dateTo: '2024.06.01',
    time : 744,
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: true,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: '2024.07.01',
    dateTo: '2024.07.08',
    time : 168,
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: true,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  }
];
const getRandomPoint = () => ({ id : nanoid(),
  ...getRandomArrayElement(mockPoints)
});

export {getRandomPoint};
