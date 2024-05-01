import {EVENT_TYPES, OFFERS,DESTIRNATIONS} from '../const.js';
import {getRandomArrayElement,getRandomInteger} from '../utils.js';


const mockPoints = [
  {
    id: 0,
    basePrice: (getRandomInteger(10,3000) / 100).toFixed(0) * 100,
    dateFrom: new Date('2024.07.14 15:24:00'),
    dateTo: new Date('2024.07.14 16:50:00'),
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: true,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    id: 1,
    basePrice: (getRandomInteger(10,3000) / 100).toFixed(0) * 100,
    dateFrom: new Date('2024.08.01 12:00:00'),
    dateTo: new Date('2024.08.01 14:40:00'),
    destination: getRandomArrayElement(DESTIRNATIONS),
    isFavorite: false,
    offers: [
      getRandomArrayElement(OFFERS)
    ],
    type: getRandomArrayElement(EVENT_TYPES)
  },
  {
    id: 2,
    basePrice: (getRandomInteger(10,3000) / 100).toFixed(0) * 100,
    dateFrom: new Date('2024.09.01 13:30:00'),
    dateTo: new Date('2024.09.01 16:40:00'),
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
