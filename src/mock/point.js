import {EVENT_TYPES, OFFERS,DESTIRNATIONS} from '../const.js';
import {getRandomArrayElement,getRandomInteger} from '../utils/common.js';
import dayjs from 'dayjs';
const MIN_PRICE = 10;
const MAX_PRICE = 3000;

const mockPoints = [
  {
    id: 0,
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: dayjs('2024.02.14'),
    dateTo: dayjs('2024.02.16'),
    time : () => this.dateTo.diff(this.dateFrom, 'm'),
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: true,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    id: 1,
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: dayjs('2024.08.01'),
    dateTo: dayjs('2024.08.05'),
    time : () => this.dateTo.diff(this.dateFrom, 'm'),
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: false,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    id: 2,
    basePrice: (getRandomInteger(MIN_PRICE,MAX_PRICE) / 100).toFixed(0) * 100,
    dateFrom: dayjs('2024.05.01'),
    dateTo: dayjs('2024.06.01'),
    time : () => this.dateTo.diff(this.dateFrom, 'm'),
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: true,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  }
];
const getRandomPoint = () => getRandomArrayElement(mockPoints);

export {getRandomPoint};
