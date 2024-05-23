
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const DATE_FORMAT_WITHOUT_TIME = 'DD/MM/YY';


//Вернуть строку с первым символом в верхнем регистре
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);


function humanizeDate(dueDate,dateFormat = DATE_FORMAT) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}


function isPointToday(dateFrom, dateTo) {
  const now = new Date();
  return (dayjs(dateFrom).isBefore(now) || dayjs(dateFrom).isSame(now)) && (dayjs(dateTo).isAfter(now) || dayjs(dateTo).isSame(now));
}
function isPointWillBe(dateFrom) {
  const now = new Date();
  return dayjs(dateFrom).isAfter(now);
}

function isPointExpired(dateTo) {
  const now = new Date();
  return dayjs(dateTo).isBefore(now);
}

function comparePrice(a,b){
  return parseFloat(b.basePrice) - parseFloat(a.basePrice);
}
function compareTime(a,b){
  return parseFloat(b.basePrice) - parseFloat(a.basePrice);
}

//Функции сравнения при сортировке
function sortDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortTime(pointA, pointB) {
  return pointB.time - pointA.time;
}
function sortPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}


export{humanizeDate,capitalize,isPointToday, isPointWillBe, isPointExpired,comparePrice,compareTime,sortDay,sortTime,sortPrice,DATE_FORMAT_WITHOUT_TIME};
