
import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';

//Вернуть строку с первым символом в верхнем регистре
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

//Случайный элемент из массива
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

//Случайное число из диапазона

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};


function humanizeDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}
function humanizeTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}
export{capitalize,getRandomArrayElement,getRandomInteger,humanizeDate,humanizeTime};


