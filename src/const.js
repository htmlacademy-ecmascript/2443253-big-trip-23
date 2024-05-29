//Услуга
const EVENT_TYPES = ['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];
const AVAILABLE_OFFERS_FOR_TYPE = {
  'taxi':[0],
  'bus':[0,1],
  'train':[0,1],
  'ship':[0,1,3],
  'drive':[],
  'flight':[0,1,3],
  'check-in':[0,1,3],
  'sightseeing':[2],
  'restaurant':[1]
};
//Список дополнительных предложений
const OFFERS = [
  {name:'Добавить багаж',price:30},{name:'Выбрать места',price:10},{name:'Добраться поездом',price:80},
  {name:'Перевести в бизнес-класс',price:50}
];

//Список направлений
const DESTINATIONS = [
  {name:'Путешествие в Египет',town:'Kair',foto:'img/photos/1.jpg'},
  {name:'Путешествие в Испанию',town:'Madrid',foto:'img/photos/2.jpg'},
  {name:'Путешествие в Италию',town:'Venecia',foto:'img/photos/3.jpg'},
  {name:'Путешествие на юг России',town:'Krasnodar',foto:'img/photos/4.jpg'},
  {name:'Путешествие на Алтай (Россия) ',town:'Gorno-altaysk',foto:'img/photos/5.jpg'},
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
const SortType = {
  DAY:'day',
  EVENT:'event',
  TIME:'time',
  PRICE:'price',
  OFFER:'offer'};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  SMALL: 'SMALL',
  MIDDLE: 'MIDDLE',
  BIG: 'BIG',
};

const DEFAULT_FILTER = 'everything';
const DEFAULT_SORT_TYPE = 'day';

const MAX_DAYS_TRIP_POINT = '365';

export {EVENT_TYPES,OFFERS,DESTINATIONS,MAX_DAYS_TRIP_POINT,DEFAULT_FILTER,DEFAULT_SORT_TYPE,UserAction,UpdateType,FilterType,SortType,AVAILABLE_OFFERS_FOR_TYPE};
