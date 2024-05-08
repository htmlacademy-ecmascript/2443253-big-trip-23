//Услуга
const EVENT_TYPES = ['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];

//Список дополнительных предложений
const OFFERS = [
  {name:'Добавить багаж',price:300},{name:'Выбрать места',price:1000},{name:'Добраться поездом',price:3000},
  {name:'Перевести в бизнес-класс',price:500}
];

//Список направлений
const DESTIRNATIONS = [
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
export {EVENT_TYPES,OFFERS,DESTIRNATIONS,FilterType};
