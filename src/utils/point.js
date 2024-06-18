
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DECIMAL = 10;
const MILLISECONDS_IN_MINUTE = 60000;


function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * MILLISECONDS_IN_MINUTE);
}
//Вернуть строку с первым символом в верхнем регистре
const capitalize = (line) => line && line[0].toUpperCase() + line.slice(1);


function humanizeDate(dueDate,dateFormat = DATE_FORMAT) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

//Перевод минутной разницы в разницу формата: дни, часы, минуты
function humanizeDiffDates (diffMinutes){
  const days = Math.trunc(diffMinutes / MINUTES_IN_HOUR / HOURS_IN_DAY),
    hours = Math.trunc((diffMinutes - days * HOURS_IN_DAY * MINUTES_IN_HOUR) / MINUTES_IN_HOUR),
    minutes = (diffMinutes - days * HOURS_IN_DAY * MINUTES_IN_HOUR - hours * MINUTES_IN_HOUR);


  if (diffMinutes < MINUTES_IN_HOUR){
    return `${minutes}M`;
  } else if (diffMinutes > MINUTES_IN_HOUR && diffMinutes < HOURS_IN_DAY * MINUTES_IN_HOUR){
    return `${hours < DECIMAL ? `0${ hours}` : hours}H ${minutes < DECIMAL ? `0${ minutes}` : minutes}M`;
  } else if (diffMinutes > HOURS_IN_DAY * MINUTES_IN_HOUR){
    return `${days}D
            ${hours < DECIMAL ? `0${ hours}` : hours}H
            ${minutes < DECIMAL ? `0${ minutes}` : minutes}M`;
  }


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

//Функции сравнения при сортировке
function sortByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortByTime(pointA, pointB) {
  return pointB.time - pointA.time;
}
function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}


export{humanizeDate,capitalize,isPointToday, isPointWillBe, isPointExpired,sortByDay,sortByTime,
  sortByPrice,DATE_FORMAT,
  humanizeDiffDates,addMinutes
};
